import java.io.File;
import java.util.HashMap;
import java.awt.Point;

  int offsetX = 0;
  int offsetY = 0;
  int s = 20;
  char brush = '1';
  boolean editing = true;
  
  HashMap map = new HashMap <java.awt.Point, Integer> ();
   

void setup() {
  frameRate(30);
  size(500+150, 500);
  if (frame != null) {
    frame.setResizable(true); //Allows resizing of the level
  }
  background (0);
}

void draw() {
  if(editing){
    background(0);
    if (mousePressed) {
        Integer g = (Integer)map.get(new java.awt.Point(mouseX/s, mouseY/s));
        if (g != null) {
            map.remove(new java.awt.Point(mouseX/s - offsetX, mouseY/s - offsetY));
        }
        System.out.println((int)brush);
        if (brush != '0') {
          map.put(new java.awt.Point(mouseX/s - offsetX, mouseY/s - offsetY), (int)brush);
        }
    }
    java.util.Iterator keySetIterator = map.keySet().iterator();
    while(keySetIterator.hasNext()){
      java.awt.Point key = (java.awt.Point)keySetIterator.next();
      int x = key.x + offsetX;
      int y = key.y + offsetY;
      switch((Integer)map.get(key)){
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
//    background (0);
  }
}

void keyPressed() {
  if (key==CODED) {
    switch(keyCode) {
    case DOWN: 
      offsetY -= 1;
      break;
    case UP:
      offsetY += 1;
      break;
    case RIGHT:
      offsetX -= 1;
      break;
    case LEFT:
      offsetX += 1;
      break;
    default:
      // message
      println ("unknown special key");
      }//switch
  } // if
  
  switch(key) {
    case '0': brush = '0'; break;//Erase
    case '1': brush = '1'; break;//Wall
    case '2': brush = '2'; break;//Lava
    case '3': brush = 'p'; break;//undefined
    case '4': brush = 'G'; break;//Spawn point
    case 's': println ("saving..."); writeLevel(); break;
    case 'o': loadLevel(); break;
  } //switch
} //keyPressed()



void writeLevel() {
  PrintWriter output;
  output = createWriter("output.txt");
  
  java.util.Iterator keySetIterator = map.keySet().iterator();
    while(keySetIterator.hasNext()){
      java.awt.Point key = (java.awt.Point)keySetIterator.next();
      int x = key.x;
      int y = key.y;
      output.println(x+","+y+","+((Integer)map.get(key)));
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
    for (int i = 0; i < lines.length; i++) {
      String[] splitArray = lines[i].split(",");
      int x = Integer.parseInt(splitArray[0]);
      int y = Integer.parseInt(splitArray[1]);
      int c = Integer.parseInt(splitArray[2]);
      map.put(new java.awt.Point(x, y), c);
     }//for
  }//else
  
}
