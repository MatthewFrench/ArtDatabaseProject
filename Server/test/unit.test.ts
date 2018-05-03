import {Configuration} from "../Pixel Platformer Server/Configuration";
import {Query} from "../Pixel Platformer Server/Database/Query";

beforeEach(function(){
  return new Promise(function(fulfill) {
      Configuration.Initialize(); //Load the config file
      Query.Initialize();
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