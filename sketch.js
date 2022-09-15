// alignment, cohesion, seperation


// action
// steering = desired velocity - velocity
// locomotion
let alignSlider, cohesionSlider, separationSlider
let flock


function setup(){
    createCanvas(1200, 800)

    alignSlider = createSlider(0, 2, 1.5, 0.1);
    cohesionSlider = createSlider(0, 2, 1, 0.1);
    separationSlider = createSlider(0, 2, 2, 0.1);

    flock = Array.from({ length: 400}, (el, idx) => {
        return  new Boid(idx)
    })
}

function draw(){
    background(0)
    flock.forEach(boid => {
        boid.checkEdges()
        boid.flock(flock)
        boid.update()
        boid.render()
    })


    
}