library(shiny)
library(httr)
library(jsonlite)

base <- "https://api.weather.gc.ca/collections/hydrometric-daily-mean/items"
rows <- list()
offset <- 0
repeat {
  res <- GET(base, query = list(STATION_NUMBER = "02YS005", limit = 10000, offset = offset, f = "json"), timeout(60))
  stop_for_status(res)
  data <- fromJSON(content(res, "text", encoding = "UTF-8"), simplifyVector = FALSE)
  feats <- data$features
  for (f in feats) {
    dis <- f$properties$DISCHARGE
    if (is.null(dis)) dis <- NA_real_
    rows[[length(rows) + 1]] <- data.frame(date = f$properties$DATE, discharge = dis, stringsAsFactors = FALSE)
  }
  if (length(feats) < 10000) break
  offset <- offset + 10000
}
df <- do.call(rbind, rows)
df$discharge <- as.numeric(df$discharge)
df <- df[!is.na(df$discharge), ]
df$date <- as.Date(substr(df$date, 1, 10))
df$year <- as.integer(format(df$date, "%Y"))
df$month <- as.integer(format(df$date, "%m"))
monthly <- aggregate(discharge ~ year + month, data = df, mean)
names(monthly) <- c("year", "month", "discharge")

ui <- fluidPage(
  titlePanel("Terra Nova River at Glovertown - monthly river flow"),
  selectInput("year", "Choose year:", choices = sort(unique(monthly$year))),
  plotOutput("flowplot"),
  p("Source: Environment and Climate Change Canada, HYDAT via MSC GeoMet. Station 02YS005, Terra Nova River at Glovertown, Newfoundland and Labrador. Daily flow averaged by month. Discharge is river flow in cubic metres per second. Python ETL code for the same data is on GitHub.")
)

server <- function(input, output) {
  output$flowplot <- renderPlot({
    d <- monthly[monthly$year == as.integer(input$year), ]
    d <- d[order(d$month), ]
    plot(d$month, d$discharge, type = "b",
         xlab = "Month", ylab = "Mean discharge (m3/s)",
         main = paste("Terra Nova River monthly mean flow,", input$year),
         xaxt = "n")
    axis(1, at = 1:12, labels = month.abb)
  })
}

shinyApp(ui = ui, server = server)
