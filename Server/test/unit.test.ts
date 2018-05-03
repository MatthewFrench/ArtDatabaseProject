beforeEach(function(){
  return new Promise(function(fulfill) {
    //Gotta call the callback to say we're done setting up
    fulfill();
  });
});

afterEach(function() {
  return new Promise(function(fulfill) {
      fulfill();
  });
});

//Test Function
test('This is my test function', function(done){
    expect(1).toEqual(1);
    expect(null).toBeNull();
  done();
});