# Neighborhood Map Project

This project utilize google map api and fourspuare api to show the places related to "food" around interested position. Places will be 
shown in map. Meanwhile, a list will present to show verbal information. The list can be filtered by typing some keywords.

## Getting start

Download the whole project from [here](https://github.com/orange9320/neighbourhood-map/). In the root of the project, there's a file called
index.html. Open it in browser to explore the project.

## Function
### Search
  In the left top, there's a text input place. That's the place that you can type any places you're interested. The place you typed will 
  show in map, together with lots of places which are related to food. All foods places can be clicked to show more information obatained
  from [foursquare.com](https://foursquare.com/).
  
  P.S. The default place is set **Los Angeles**.
  
### List View
  In desktop, there will be a list view in the right side of screen. It shows the information of all found places. If you feel too many,
  the text input place is for the filtering. Also, each item can be clicked, and the corresponding place in map will respond to you.
  
  When access with narrow devices, like phones. The list will be hidden. Don't worry. In this case, there'll be a filtering icon at right
  side of search place. Just click once, the list show, and will hide again for another click.
  
## References
* [Google JS map API](https://developers.google.com/maps/documentation/javascript/)
* [Foursquare API](https://developer.foursquare.com/)
