$(function(){

  window.eno = window.eno || new Object;

  var fftSize = 32

  function setup() {
    createCanvas( windowWidth, windowHeight )

    window.eno.drums;

    fft = FFT( fftSize )

    noStroke()
    colorMode( HSB, 255 )
  }

  function draw() {
    background( 64 )

    var numBars = fftSize / 2,
        barHeight = ( height - 1 ) / numBars,
        barColor = null, 
        value = null

    for( var i = 0; i < numBars; i++ ) {
      barColor = color( ( i / numBars ) * 255, 255, 255 )
      fill( barColor ) 

      // read FFT value, which ranges from 0-255, and scale it.
      value = ( fft[ i ] / 255 ) * width

      rect( 0, barHeight * i, value, barHeight )
    }
  }
});