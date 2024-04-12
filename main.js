const HEADS = [
  {
    label: "one",
    radius: 40 / 2,
    color: "#F20306",
  },
  {
    label: "two",
    radius: 50 / 2,
    color: "#FF624C",
  },
  {
    label: "three",
    radius: 72 / 2,
    color: "#A969FF",
  },
  {
    label: "four",
    radius: 85 / 2,
    color: "#FFAF02",
  },
  {
    label: "five",
    radius: 106 / 2,
    color: "#FC8611",
  },
  {
    label: "six",
    radius: 140 / 2,
    color: "#F41615",
  },
  {
    label: "seven",
    radius: 160 / 2,
    color: "#FDF176",
  },
  {
    label: "eight",
    radius: 196 / 2,
    color: "#FEB6AC",
  },
  {
    label: "nine",
    radius: 220 / 2,
    color: "#F7E608",
  },
  {
    label: "ten",
    radius: 270 / 2,
    color: "#89CE13",
  },
  {
    label: "eleven",
    radius: 300 / 2,
    color: "#26AA1E",
  },
];



var  Bodies = Matter.Bodies,
  Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  World = Matter.World;
  Body = Matter.Body,
  Sleeping = Matter.Sleeping,
  Collision = Matter.Collision;
//Events = Matter.Events;

const engine = Engine.create();
const render = Render.create({
  engine,
  element: document.body, 
  options:{wireframes:false,
  background:"#FFD1DC",
  width:620,
  height:850,
}
  
});

const world = engine.world;

const ground = Bodies.rectangle(310, 820, 620,60,{
   isStatic: true,
  render: {fillStyle: "#FF69B4",}
  },);

const leftwall = Bodies.rectangle(15, 395, 30, 790,{
  isStatic: true,
 render: {fillStyle: "#FF69B4",}
 },);

 const rightwall = Bodies.rectangle(605, 395, 30, 790,{
  isStatic: true,
 render: {fillStyle: "#FF69B4",}
 },);

 const topLine = Bodies.rectangle(310, 150, 620,2,{
  isStatic: true,
  isSensor: true,
 render: {fillStyle: "#FF69B4",},
 label: "topLine",
 },);


World.add(world, [ground, leftwall, rightwall, topLine]);

Render.run(render);
Runner.run(engine);

let currentHead = null;
let disableAction = false;

function getRandomHead() {
  const randomIndex = Math.floor(Math.random() * 5);
  const head = HEADS[randomIndex];

  if (currentHead && currentHead.label === head.label)
    return getRandomHead();

  return head;
}


function addCurrentHead() {
  const randomHead = getRandomHead();

  const body = Bodies.circle(300, 50, randomHead.radius, {
    label: randomHead.label,
    isSleeping: true,
    render: {
      fillStyle: randomHead.color,
    //  sprite: { texture: `/${randomHead.label}.png` }, 
    },
    restitution: 0.7,
  });

currentHead = body;

World.add(world, body);
}

window.onkeydown = (event) => {
  if(disableAction) return;
  switch (event.code) {
    case "ArrowLeft":
      Body.setPosition(currentHead, {
        x: currentHead.position.x - 5,
        y: currentHead.position.y,
      })
      break;
    case "ArrowRight":
      Body.setPosition(currentHead, {
        x: currentHead.position.x + 5,
        y: currentHead.position.y,
      })
      break;
    case "ArrowDown":
      disableAction = true;
      Sleeping.set(currentHead, false);
      setTimeout(() => {
        addCurrentHead();
        disableAction = false;},
        1000)
        break;
    case "Space":
      disableAction = true;
      Sleeping.set(currentHead, false);
      setTimeout(() => {
        addCurrentHead();
        disableAction = false;},
        1000) 
  }
}



// Get the score display element
const scoreDisplay = document.getElementById("score");

// Set initial score
let score = 0;

// Function to update the score display
function updateScore() {
    scoreDisplay.textContent = score;
}

// Function to increase the score
function increaseScore() {
    score += 5; 
    updateScore(); // Update the score display
}

Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((Collision) => {
    if (Collision.bodyA.label == Collision.bodyB.label){
      
      increaseScore();
      World.remove(world,[Collision.bodyA, Collision.bodyB]);


      const index = HEADS.findIndex(
        (head) => head.label == Collision.bodyA.label
      );
      if (index==HEADS.lenght - 1) return;
      
      const newHead = HEADS[index + 1]
      const body = Bodies.circle(
        Collision.collision.supports[0].x,
        Collision.collision.supports[0].y,
        newHead.radius,
        {
          render:{
            fillStyle:newHead.color,
            sprite: { texture: `/${newHead.label}.png` },
          },
          restitution: 0.7, 
          label:newHead.label,
       }
        );
        World.add(world, body);
    }
    if (
      (Collision.bodyA.label === "topLine") &&
      !disableAction
    ) {
      alert("Game over, try again =) ", location.reload());
      
    }
  });
});

addCurrentHead();
