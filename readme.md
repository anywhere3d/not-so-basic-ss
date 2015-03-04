#Not So Basic Signalling Server

###Install:

`npm install fjsousa/not-so-basic-ss`

###Run

`node index`

Open some tabs in your browser at 

```
localhost:5000/:experiment
```

Where `:experiment` can be any string of caracters a-z.

Go to the first tab and open the dev console. Write

```javascript
var allPeers = new AllPeers();

allPeers.update(function (peers) {
  console.log('You have %d peers', peers.length );

  allPeers.poke();
});
```

The other tabs should have some work to do.


###Production 

```
http://not-so-basic-ss.herokuapp.com/:experiment
```

###List peers

```
host/list/:experiment

```


