library(shiny)

ui <- fluidPage(
  titlePanel("Engine size vs horsepower"),
  plotOutput("myplot")
)

server <- function(input, output) {
  output$myplot <- renderPlot({
    plot(mtcars$disp, mtcars$hp,
         xlab = "Displacement (disp)",
         ylab = "Horsepower (hp)",
         main = "Displacement vs Horsepower")
  })
}

shinyApp(ui = ui, server = server)

