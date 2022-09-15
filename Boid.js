class Boid {
    constructor(idx){
        this.id = idx
        this.position = createVector(random(width), random(height))
        this.velocity = p5.Vector.random2D()
        this.velocity.setMag(random(2,4))
        this.acceleration = createVector(0,0)
        this.maxForce = 0.2
        this.maxSpeed = 5
        this.r = random(10,90)
        this.col = [random(255), 20, 150, 120]
        this.wanderTheta = 0
    }

    checkEdges(){
        if(this.position.x < 0){
            this.position.x = width

        } else if(this.position.x > width){
            this.position.x = 0

        }
        if(this.position.y < 0){
            this.position.y = height

        }else if(this.position.y > height){
            this.position.y = 0

        }
    }

    addForce(f){
        this.acceleration.add(f)
    }



    cohesion(boids){
        let comeTogetherForce = createVector(0,0)
        let perceptionRadius = this.r * 4
        let totalGoodVibe = 0

        boids.forEach( boid => {
            let d = p5.Vector.dist(this.position, boid.position)
            if(boid != this && d < perceptionRadius){
                comeTogetherForce.add(boid.position)
                totalGoodVibe++
            }
        })
        if(totalGoodVibe > 0){
            // get the average force by dividing by the number of influencers
            comeTogetherForce.div(totalGoodVibe)
            comeTogetherForce.sub(this.position)
            comeTogetherForce.setMag(this.maxSpeed)
            comeTogetherForce.sub(this.velocity)
            comeTogetherForce.limit(this.maxForce)
        }
        return comeTogetherForce
    }

    align(boids){
        let alignmentForce = createVector(0,0)
        let perceptionRadius = this.r * 2
        let totalFOMO = 0

        boids.forEach( boid => {
            let d = p5.Vector.dist(this.position, boid.position)
            if(boid != this && d < perceptionRadius){
                alignmentForce.add(boid.velocity)
                totalFOMO++
            }
        })

        if(totalFOMO > 0){
             // get the average force by dividing by the number of influencers
            alignmentForce.div(totalFOMO)
            alignmentForce.setMag(this.maxSpeed)
            alignmentForce.sub(this.velocity)
            alignmentForce.limit(this.maxForce)
        }
        return alignmentForce
    }

    seperate(boids){
        let seperationForce = createVector(0,0)
        let perceptionRadius = this.r * 2
        let totalSeperationAnxiety = 0
        boids.forEach((boid, idx) => {
            // check each boid to see if it's too close and if necessary, move away
            let d = p5.Vector.dist(this.position, boid.position)
            //if(boid.id === 0 && boid != this && d < perceptionRadius){
            if(boid != this && d < perceptionRadius){
                //console.log(d)
                // get the difference between the positions
                let diff = p5.Vector.sub(this.position, boid.position)
                // 
                diff.div(d * d)
                seperationForce.add(diff)
                totalSeperationAnxiety++
            } 
        })
        if(totalSeperationAnxiety > 0){
             // get the average force by dividing by the number of influencers
            seperationForce.div(totalSeperationAnxiety)
            seperationForce.setMag(this.maxSpeed)
            seperationForce.sub(this.velocity)
            seperationForce.limit(this.maxForce)
        }

        return seperationForce
    }

    wander(){
        let displaceRange = 10
        this.wanderTheta += random(-displaceRange, displaceRange)
        let wanderRadius = 500
        let lookAhead = this.velocity.copy().setMag(50)
        lookAhead.add(this.pos)
        let theta = this.wanderTheta + this.velocity.heading()
        let wanderX = lookAhead.x + cos(theta) * wanderRadius/2
        let wanderY = lookAhead.y + sin(theta) * wanderRadius/2
        let wanderPoint = createVector(wanderX, wanderY)
        let wanderLust = wanderPoint.sub(this.position)
        return wanderLust
    }

    flock(boids){
        // seperate the boids from each other
        let seperation = this.seperate(boids)
        let alignment = this.align(boids)
        let cohesion = this.cohesion(boids)
        
        this.addForce(seperation.mult(1.9))
        this.addForce(alignment.mult(1.5))
        this.addForce(cohesion.mult(1))

        if(this.id < 30){
            if(random(1000) > 990){
                let wander = this.wander()
                this.addForce(wander.mult(30))
            }

        }

        // if(random(1000) > 900){
        //     let wander = this.wander()
        //     this.addForce(wander.mult(10))
        // }

    }


    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);
      }

    render(){
        stroke(255);
        strokeWeight(1);
        //point(this.position.x, this.position.y);
        if(this.id === 0){
            fill('green')
        } else {
            fill(this.col)
        }
        
        ellipse(this.position.x, this.position.y, this.r)
    }
}