# Feed reader project

In this project, all codes are written in jasmine/spec/feedreader.js. All tests are written based on todo comment in the file.

## To download

To get the newest updated version, [download](https://github.com/orange9320/frontend-nanodegree-feedreader-master) from here.

## To start
#### To run locally

Simply unzip the project( if needed), and enter the most root folder of the project. Open the index.html in a browser and explore the project.

#### Host site on Window 10

1. Open control penal
2. Click "Programs"
3. Open "Turn Windows features on or off" window
4. Select the "Internet Information Servies" and click "OK" (This might cause restarting the computer)
5. Goto "C:\inetpub\wwwroot" and copy the whole project to the folder.
6. Visit localhost in a browser or determine your current global ip and visit it.

#### Alternative site host
1. Run a local server:
  ```bash
  $> cd /path/to/your-project-folder
  $> python -m SimpleHTTPServer 8080
  ```

2. Open a browser and visit localhost:8080
3. Download and install [ngrok](https://ngrok.com/) to the top-level of the project directory to make the local server accessible remotely.
  ``` bash
  $> cd /path/to/your-project-folder
  $> ./ngrok http 8080
  ```
