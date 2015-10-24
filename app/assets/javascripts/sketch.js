$(function(){

  //var fftSize = 32

  var flock, text;

  window.setup = function() {
    createCanvas(windowWidth, windowHeight);

    window.setupGibber();
    var ajax = new AjaxRequest(window.eno);

    // grab variables from page layout
    window.eno.vars = {};
    window.eno.vars.sentiment = $('#bootstrap-music').data('sentiment');
    window.eno.vars.contentLength = $('#bootstrap-music').data('contentLength');
    window.eno.vars.chordProgression = $('#bootstrap-music').data('chordProgression');
    window.eno.vars.tempo = $('#bootstrap-music').data('tempo');

    // store the canvas width and height so we can init birds later
    window.eno.vars.windowWidth = windowWidth;
    window.eno.vars.windowHeight = windowHeight;

    // fft = FFT( fftSize );

    // noStroke();
    //colorMode(HSB);

    flock = new Flock();
    // Add an initial set of birds into the system
    for (var i = 0; i < Math.floor(window.eno.vars.tempo / 2); i++) {
      var b = new Bird(width/2,height/2);
      flock.addBird(b);
    }

    // store it for later
    window.eno.flock = flock;
  }

  // window.draw = function() {
  //   background( 64 );

  //   var numBars = fftSize / 2,
  //       barHeight = ( height - 1 ) / numBars,
  //       barColor = null,
  //       value = null

  //   for( var i = 0; i < numBars; i++ ) {
  //     barColor = color( ( i / numBars ) * 255, 255, 255 );
  //     fill( barColor );

  //     // read FFT value, which ranges from 0-255, and scale it.
  //     value = ( fft[ i ] / 255 ) * width;

  //     rect( 0, barHeight * i, value, barHeight );
  //   }
  // }

  window.draw = function() {
    background(51);
    flock.run();
  }

  // Original code --
  // The Nature of Code
  // Daniel Shiffman
  // http://natureofcode.com
  // Some additions by team SSD

  // Flock object
  // Does very little, simply manages the array of all the birds

  function Flock() {
    // An array for all the birds
    this.birds = []; // Initialize the array
  }

  Flock.prototype.run = function() {
    for (var i = 0; i < this.birds.length; i++) {
      this.birds[i].run(this.birds);  // Passing the entire list of birds to each bird individually
    }
  }

  Flock.prototype.addNBirds = function(n) {
    for (var i = 0; i < n; i++) {
      var b = new Bird(width/2,height/2);
      this.birds.push(b);
    }
  }

  Flock.prototype.removeNBirds = function(n) {
    this.birds.splice(0, n);
  }

  Flock.prototype.addBird = function(b) {
    this.birds.push(b);
  }

  Flock.prototype.removeBird = function() {
    this.birds.splice(-1, 1);
  }

  // Bird class
  // Methods for Separation, Cohesion, Alignment added

  function Bird(x,y) {
    this.acceleration = createVector(0,0);
    this.velocity = createVector(random(-1,1),random(-1,1));
    this.position = createVector(x,y);
    this.r = 3.0;
    this.maxspeed = Math.floor(Math.sqrt(window.eno.vars.tempo));    // Maximum speed
    this.maxforce = 0.05; // Maximum steering force
  }

  Bird.prototype.run = function(birds) {
    this.flock(birds);
    this.update();
    this.borders();
    this.render();
  }

  Bird.prototype.applyForce = function(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  // We accumulate a new acceleration each time based on three rules
  Bird.prototype.flock = function(birds) {
    var sep = this.separate(birds);   // Separation
    var ali = this.align(birds);      // Alignment
    var coh = this.cohesion(birds);   // Cohesion
    // Arbitrarily weight these forces
    sep.mult(1.5);
    ali.mult(1.0);
    coh.mult(1.0);
    // Add the force vectors to acceleration
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }

  // Method to update location
  Bird.prototype.update = function() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelertion to 0 each cycle
    this.acceleration.mult(0);
  }

  // A method that calculates and applies a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  Bird.prototype.seek = function(target) {
    var desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target
    // Normalize desired and scale to maximum speed
    desired.normalize();
    desired.mult(this.maxspeed);
    // Steering = Desired minus Velocity
    var steer = p5.Vector.sub(desired,this.velocity);
    steer.limit(this.maxforce);  // Limit to maximum steering force
    return steer;
  }

  Bird.prototype.getColourForBin = function(n){
    var binValues = ['#d73027','#f46d43','#fdae61','#fee090','#ffffbf','#e0f3f8','#abd9e9','#74add1','#4575b4'];
    return binValues[n];
  }

  Bird.prototype.render = function() {
    // Draw a triangle rotated in the direction of velocity
    var theta = this.velocity.heading() + radians(90);

    //bin bird sentiment then get colour
    var birdSentimentBin = Math.floor(window.eno.vars.sentiment * 10);
    var birdSentimentRGB = this.getColourForBin(birdSentimentBin);

    fill(birdSentimentRGB);
    stroke(birdSentimentRGB);
    push();
    translate(this.position.x,this.position.y);
    rotate(theta);
    beginShape();
    vertex(0, -this.r*2);
    vertex(-this.r, this.r*2);
    vertex(this.r, this.r*2);
    endShape(CLOSE);
    pop();
  }

  // Wraparound
  Bird.prototype.borders = function() {
    if (this.position.x < -this.r)  this.position.x = width +this.r;
    if (this.position.y < -this.r)  this.position.y = height+this.r;
    if (this.position.x > width +this.r) this.position.x = -this.r;
    if (this.position.y > height+this.r) this.position.y = -this.r;
  }

  // Separation
  // Method checks for nearby birds and steers away
  Bird.prototype.separate = function(birds) {
    var desiredseparation = 25.0;
    var steer = createVector(0,0);
    var count = 0;
    // For every boid in the system, check if it's too close
    for (var i = 0; i < birds.length; i++) {
      var d = p5.Vector.dist(this.position,birds[i].position);
      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if ((d > 0) && (d < desiredseparation)) {
        // Calculate vector pointing away from neighbor
        var diff = p5.Vector.sub(this.position,birds[i].position);
        diff.normalize();
        diff.div(d);        // Weight by distance
        steer.add(diff);
        count++;            // Keep track of how many
      }
    }
    // Average -- divide by how many
    if (count > 0) {
      steer.div(count);
    }

    // As long as the vector is greater than 0
    if (steer.mag() > 0) {
      // Implement Reynolds: Steering = Desired - Velocity
      steer.normalize();
      steer.mult(this.maxspeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }
    return steer;
  }

  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  Bird.prototype.align = function(birds) {
    var neighbordist = 50;
    var sum = createVector(0,0);
    var count = 0;
    for (var i = 0; i < birds.length; i++) {
      var d = p5.Vector.dist(this.position,birds[i].position);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(birds[i].velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxspeed);
      var steer = p5.Vector.sub(sum,this.velocity);
      steer.limit(this.maxforce);
      return steer;
    } else {
      return createVector(0,0);
    }
  }

  // Cohesion
  // For the average location (i.e. center) of all nearby birds, calculate steering vector towards that location
  Bird.prototype.cohesion = function(birds) {
    var neighbordist = 50;
    var sum = createVector(0,0);   // Start with empty vector to accumulate all locations
    var count = 0;
    for (var i = 0; i < birds.length; i++) {
      var d = p5.Vector.dist(this.position,birds[i].position);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(birds[i].position); // Add location
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.seek(sum);  // Steer towards the location
    } else {
      return createVector(0,0);
    }
  }

});
