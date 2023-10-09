const timerOutput = document.querySelector("#timer");
const startStopBtn = document.querySelector("#start-stop-btn");

class Timer {
    isStopped;
    numberOfMinutes;
    bell;
    secondBell;
    thirdBell;
    time;  
    interval; 
    startTime;
    timeOfLastCall;
    timerID;

    constructor(numberOfMinutes) {
        this.numberOfSeconds = numberOfMinutes * 60;
        this.time = this.numberOfSeconds;        
        this.isStopped = true;  
        this.interval = 1000;  
        this.bell = new Audio("./assets/media/bell-2.mp3"); 
        this.secondBell = this.time - 14;
        this.thirdBell = this.time - 28;              
    }

    start() {        
        startStopBtn.classList.remove("stopped");
        startStopBtn.classList.add("running");        
        startStopBtn.setAttribute("aria-label", "stop timer");
        this.isStopped = false;
        this.ringBell();
        this.startTime = Date.now();
        this.timerID = setTimeout(this.run.bind(this), this.interval);
    }

    stop() {       
        clearTimeout(this.timerID);
        startStopBtn.classList.remove("running");
        startStopBtn.classList.add("stopped");
        startStopBtn.setAttribute("aria-label", "start timer");
        this.isStopped = true;
        this.reset();   
        timerOutput.textContent = this.formatTimeString();
        
    }
    
    formatTimeString() {
        let minutes = (Math.floor(this.time/60)).toString().padStart(2,"0");
        let seconds = (Math.floor(this.time - minutes * 60)).toString().padStart(2,"0");
        return `${minutes}:${seconds}`;
    }

    reset() {  
        this.time = this.numberOfSeconds;                     
    }

    ringBell() {    
        this.bell.currentTime = 0;   
        this.bell.play();
    }

    run() {
        if (this.time === this.numberOfSeconds) {           
            this.timeOfLastCall = this.startTime;
        }

        if (this.time >= 0) {        
            timerOutput.textContent = this.formatTimeString();
            //check if it's time to ring the bell
            if (this.time === this.secondBell || this.time === this.thirdBell) {
                this.ringBell();
            }
            // stop if the user has switched tabs
            if (!document.hasFocus()) {
                this.stop();                    
            } else {
                // calculate and correct for interval drift 
                let msElapsed = (Date.now() - this.startTime);                     
                let intervalDrift = msElapsed - ((this.numberOfSeconds + 1 - this.time) * 1000);

                if (intervalDrift > 0) {  
                    this.interval -= intervalDrift;      
                } else {   
                    this.interval = 1000;
                }
                
                //decrement counter, set function call-time, call next iteration
                this.time --;
                this.timeOfLastCall = Date.now();
                this.timerID = setTimeout(this.run.bind(this), this.interval);
            }
        } else {
            //stop timer when countdown has finished
            //ring bells to end meditation
            this.stop();
            this.ringBell();   
            setTimeout(this.ringBell.bind(this), 8000);
        }
    }
}

const timer = new Timer(2);
timerOutput.textContent = timer.formatTimeString();

startStopBtn.addEventListener("click", () => {
    if (timer.isStopped) {
        //timer was stopped or not started, start timer
        timer.start();      
    } else {
        //timer was running, stop timer      
        timer.stop();        
    }    
});