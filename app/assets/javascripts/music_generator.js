$(function(){

  Gibber.init(); // REQUIRED!

  Gibber.scale.root.seq( ['c4','eb4'], 2);

  a = Mono('bass').note.seq( [0,7], 1/8 );

  b = EDrums('xoxo');
  b.snare.snappy = 1;

  c = Mono('easyfx').note.seq( Rndi(0,12), [1/4,1/8,1/2,1,2].rnd( 1/8,4 ) );

});
