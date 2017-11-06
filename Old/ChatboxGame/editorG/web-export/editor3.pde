  int h = 20;
  int w = 30;
  int s = 20;
  char [] [] map = new char[w] [h];
  char brush = '1';
  boolean editing = true;

void setup() {
  frameRate(30);
  int x,y;
  for (y=0; y<h; y++) {
    for (x=0; x<w; x++) {
      map[x][y] = '0';
    }
  }
  size(w*s+150, h*s);
  if (frame != null) {
    frame.setResizable(true); //Allows resizing of the level
  }
  background (0);
}

void draw() {
  if(editing){
    background(0);
    if (mousePressed) {
      if (mouseX/s > -1 && mouseX/s < w && mouseY/s > -1 && mouseY/s < h){
        map[mouseX/s][mouseY/s] = brush;
      }
    }
    int x, y;
    for (x = 0; x < w; x++){
      for (y = 0; y < h; y++){
        switch(map[x] [y]){
          case '1':
            fill(150,100,0);
            rect(x*s, y*s, s, s);
            break;
          case '2':
            fill(200,0,0);
            rect(x*s, y*s, s, s);
            break;
          case 'G':
            fill(0,200,0);
            ellipse(x*s+(s/2), y*s+(s/2), s, s);
            break;
          case 'p':
            fill(0,165,0);
            rect(x*s, y*s, s, s);
            break;
          default:
            noFill();
            stroke(25);
            rect(x*s, y*s, s, s);
            break;
        }
      }
    } 
//    background (0);
  }
}

void keyPressed() {
  if (key==CODED) {
    switch(keyCode) {
    case DOWN: 
      println ("saving...");
      writeLevel();
      break;
    case UP:
      loadLevel();
      break;
    default:
      // message
      println ("unknown special key");
      }//switch
  } // if
  
  switch(key) {
    case '0': brush = '0'; break;//empty
    case '1': brush = '1'; break;//ground
    case '2': brush = '2'; break;//spikes
    case '3': brush = 'p'; break;//player start
    case '4': brush = 'G'; break;//goal
  } //switch
} //keyPressed()



void writeLevel() {
  int x=0,y=0;
  PrintWriter output;
  output = createWriter("output.sdl");
  for (y=0; y<h; y++) {
    output.print("   LET map$(");
    output.print(y+1);
    output.print(")  = ");
    if (y < 9)
      output.print(" ");
    output.print('"');
    for (x=0; x<w; x++) {
      output.print(map[x][y]);
      if (x < w-1)
        output.print(',');
    }
    output.println("\"");
    }
  output.flush(); // Writes the remaining data to the file
  output.close(); // Finishes the file
  println("File saved.");
}

void loadLevel() {
  selectInput("Select a level file to load:", "fileSelected");
}

void fileSelected(File file) {
  if (file == null) {
    println("Window was closed or the user hit cancel");
  } else {
    println("User selected " + file.getAbsolutePath());
    println("Loading...");
    String lines[] = loadStrings (file);
    println("there are " + lines.length + " lines");
    for (int i =0 ; i < lines.length; i++) {
      println(lines[i]);
     }//for
  }//else
}

