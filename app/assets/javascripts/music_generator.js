$(function(){

  window.eno = window.eno || new Object;

  Gibber.init(); // REQUIRED!

  drums = EDrums('x*o*x*o-')
    drums.amp = .75

  bass = FM('bass')
    .note.seq( [0,0,0,7,14,13].rnd(), [1/8,1/16].rnd(1/16,2) )

  rhodes = Synth( 'rhodes', {amp:.35} )
    .chord.seq( Rndi(0,6,3), 1 )
    .fx.add( Delay() )

  Gibber.scale.root.seq( ['c4','ab3','bb3'], [4,2,2] )
  Gibber.scale.mode.seq( ['Minor','Mixolydian'], [6,2] )

  window.eno.drums = drums;

});
