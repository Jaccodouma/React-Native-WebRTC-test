# A quick how to run this thing (in VS Code & assuming you've set up react native and all that): 
### Setup
1. Clone this repo
2. Open the "dutchnow_rn" folder in VS Code
3. Open the terminal ``ctrl + ` ``

### Run backend 
1. Enter `cd backend && npm i && node index`. 
2. Copy the IP and port in the terminal (should be nice and purple) 
3. Go to `dutchnow_rn/pages/videoCall/VideoCall_Home.tsx` and look for `socket = io.connect('http://192.168.0.191:3000');` on line 53 and replace the IP with the one you copied

### Run app
1. Open another termial (Or split the current one with `ctrl + shift + 5`)
2. Connect two android devices
3. In the new terminal: enter `npm i && npx react-native run-android`

### Make the call
1. On the first device click "VideoCall" and wait for the server terminal to say it has received an offer (this should be pretty much instantly)
2. On the other device, click "VideoCall" 
3. Smile (: 
