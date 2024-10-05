// ==UserScript==
// @name        Slither.io Hack by Phytone
// @namespace   http://slither.com/io
// @description Slither.io Hack by Phytone
// @match    http://slither.com/io
// @version     1.0.0
// @grant       none
// ==/UserScript==
window.log = function() {
    if (window.logDebugging) {
        console.log.apply(console, arguments);
    }
};

window.appendDiv = function(id, className, style) {
    var div = document.createElement('div');
    if (id) {
        div.id = id;
    }

    if (className) {
        // Set the class name
        div.className = className;
    }
    // Check for css styles
    if (style) {
        // Set the css styles
        div.style = style;
    }
    // Append the div to the page
    document.body.appendChild(div);
};

window.snake = {

    xx: 0, // x-coordinate of the snake

    yy: 0, // y-coordinate of the snake

    sct: 0, // snake's current type

    fam: 0, // snake's family (length)

    nk: 0, // snake's nickname

    sc: 0, // snake's scale

    // Add other properties as needed

};

// Saves username when you click on "Play" button
window.play_btn.btnf.addEventListener('click', function() {
    window.saveNick(window.nick.value);
});
// Save nickname when you press "Enter"
window.nick_holder.addEventListener('keypress', function(e) {
    if (e.keyCode == 13) {
        window.saveNick(window.nick.value);
    }
});
// Save nickname
window.saveNick = function(nick) {
    window.savePreference('savedNick', nick);
};
//Easy get mouseCoords
document.addEventListener("mousemove", function(e){
	window.mouseCoords = {
		x: e.clientX,
		y: e.clientY
	}
})
// Set fake mouse coordinates
window.setMouseCoordinates = function(x, y) {
    window.xm = x;
    window.ym = y;
};
// Coordinates relative to the center (snake position).
window.mouseRelativeToCenter = function(x, y) {
    var mapX = x - window.getWidth() / 2;
    var mapY = y - window.getHeight() / 2;
    return [mapX, mapY];
};
// Mouse coordinates to screen coordinates
window.mouseToScreen = function(x, y) {
    var screenX = x + (window.getWidth() / 2);
    var screenY = y + (window.getHeight() / 2);
    return [screenX, screenY];
};
// Screen to canvas coordinates
window.screenToCanvas = function(x, y) {
    var canvasX = window.csc * (x * window.canvasRatio[0]) - parseInt(window.mc.style.left);
    var canvasY = window.csc * (y * window.canvasRatio[1]) - parseInt(window.mc.style.top);
    return [canvasX, canvasY];
};
// Map to mouse coordinates
window.mapToMouse = function(x, y) {
    var mouseX = (x - window.getX()) * window.gsc;
    var mouseY = (y - window.getY()) * window.gsc;
    return [mouseX, mouseY];
};
// Canvas width
window.getWidth = function() {
    return window.ww;
};
// Canvas height
window.getHeight = function() {
    return window.hh;
};
// X coordinates on the screen
window.getX = function() {
    return window.snake.xx;
};
// Y coordinates on the screen
window.getY = function() {
    return window.snake.yy;
};
// Updates the relation between the screen and the canvas
window.onresize = function() {
    window.resize();
    // Canvas different size from the screen (often bigger). Gives a ratio so we can convert
    window.canvasRatio = [window.mc.width / window.getWidth(), window.mc.height / window.getHeight()];
};
// Lets you zoom in and out using the mouse wheel
window.setZoom = function(e) {
    // Scaling ratio
    if (window.gsc) {
        window.gsc *= Math.pow(0.9, e.wheelDelta / -120 || e.detail / 2 || 0);
    }
};
// FPS counter
window.framesPerSecond = {
    startTime: 0,
    frameNumber: 0,
    filterStrength: 40,
    lastLoop: 0,
    frameTime: 0,
    getFPS: function() {
        var thisLoop = performance.now();
        var thisFrameTime = thisLoop - this.lastLoop;
        this.frameTime += (thisFrameTime - this.frameTime) / this.filterStrength;
        this.lastLoop = thisLoop;
        return (1000 / this.frameTime).toFixed(0);
    }
};

// Set background - default is slither.io's own background
function setBackground(url = '/s/bg45.jpg') {
    window.ii.src = url;
}
// Reset zoom
window.resetZoom = function() {
        window.gsc = 0.9;
    }
    // Get scaling ratio
window.getScale = function() {
    return window.gsc;
};
// Snake length
window.getSnakeLength = function() {
    return (Math.floor(150 * (window.fpsls[window.snake.sct] + window.snake.fam / window.fmlts[window.snake.sct] - 1) - 50) / 10);
};

window.changeLength = function(length) {
    window.snake.fam = length;
};

// Save the original slither.io onmousemove function so we can re enable it back later
window.mousemovelistener = window.onmousemove;

// Starts the bot
window.launchBot = function() {
    window.log('Starting Bot.');
    window.isBotRunning = true;
    // Removed the onmousemove listener so we can move the snake manually by setting coordinates
    window.onmousemove = function() {};
};
// Stops the bot
window.stopBot = function() {
    window.log('Stopping Bot.');
    // Re enable the original onmousemove function
    window.onmousemove = window.mousemovelistener;
    window.isBotRunning = false;
    // Clear the interval which starts the bot
};

// Connects the bot
window.connectBot = function() {
    if (!window.autoRespawn) return;
    // Stop the bot
    window.stopBot();
    window.log('Connecting...');
    // Connect the bot
    window.connect();
    // Check if bot can start
    window.botCanStart = setInterval(function() {
        if (window.playing) {
            window.launchBot();
            clearInterval(window.botCanStart);
        }
    }, 100);
};

// Save variable to local storage
window.savePreference = function(item, value) {
    window.localStorage.setItem(item, value);
};

// Load a variable from local storage
window.loadPreference = function(preference, defaultVar) {
    var savedItem = window.localStorage.getItem(preference);
    if (savedItem !== null) {
        if (savedItem == 'true') {
            window[preference] = true;
        } else if (savedItem == 'false') {
            window[preference] = false;
        } else {
            window[preference] = savedItem;
        }
        window.log('Setting found for ' + preference + ': ' + window[preference]);
    } else {
        window[preference] = defaultVar;
        window.log('No setting found for ' + preference + '. Used default: ' + window[preference]);
    }
    return window[preference];
};

// Save the original slither.io onkeydown function so we can add stuff to it
document.oldKeyDown = document.onkeydown;
// Re write the function with our function
document.onkeydown = function(e) {
    // Original slither.io onkeydown function + whatever is under it
    document.oldKeyDown(e);
    if (document.activeElement.parentElement !== window.nick_holder) {
        // Letter `T` to toggle bot
        if (e.keyCode === 84) {
            if (window.isBotRunning) {
                window.stopBot();
                window.isBotEnabled = false;
            } else {
                window.launchBot(5);
                window.isBotEnabled = true;
            }
        }
        // Letter 'U' to toggle debugging (console)
        if (e.keyCode === 85) {
            window.logDebugging = !window.logDebugging;
            console.log('Log debugging set to: ' + window.logDebugging);
            window.savePreference('logDebugging', window.logDebugging);
        }
        // Letter 'Y' to toggle debugging (visual)
        if (e.keyCode === 89) {
            window.visualDebugging = !window.visualDebugging;
            console.log('Visual debugging set to: ' + window.visualDebugging);
            window.savePreference('visualDebugging', window.visualDebugging);
        }
        // Letter 'I' to toggle autorespawn
        if (e.keyCode === 73) {
            window.autoRespawn = !window.autoRespawn;
            console.log('Automatic Respawning set to: ' + window.autoRespawn);
            window.savePreference('autoRespawn', window.autoRespawn);
        }
        // Letter 'O' to change rendermode (visual)
        if (e.keyCode === 79) {
            window.mobileRender = !window.mobileRender;
            console.log('Mobile rendering set to: ' + window.mobileRender);
            window.savePreference('mobileRender', window.mobileRender);
            // Set render mode
            if (window.mobileRender) {
                setBackground('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs');
                window.render_mode = 1;
            } else {
                setBackground();
                window.render_mode = 2;
            }
        }
        // Letter 'P' to toggle hunting Prey
        if (e.keyCode === 80) {
	    window.huntPrey = !window.huntPrey;
            console.log('Prey hunting set to: ' + window.huntPrey);
            window.savePreference('huntPrey', window.huntPrey);
        }

        // Letter 'C' to toggle Collision detection / enemy avoidance
        if (e.keyCode === 67) {
            window.collisionDetection = !window.collisionDetection;
            console.log('collisionDetection set to: ' + window.collisionDetection);
            window.savePreference('collisionDetection', window.collisionDetection);
        }

        // Letter 'A' to increase collision detection radius
        if (e.keyCode === 65) {
            window.collisionRadiusMultiplier++;
            console.log('collisionRadiusMultiplier set to: ' + window.collisionRadiusMultiplier);
            window.savePreference('collisionRadiusMultiplier', window.collisionRadiusMultiplier);
        }

        // Letter 'S' to decrease collision detection radius
        if (e.keyCode === 83) {
            if (window.collisionRadiusMultiplier > 1) {
                window.collisionRadiusMultiplier--;
                console.log('collisionRadiusMultiplier set to: ' + window.collisionRadiusMultiplier);
                window.savePreference('collisionRadiusMultiplier', window.collisionRadiusMultiplier);
            }
        }

        // Letter 'D' to toggle defence mode
        if (e.keyCode === 68) {
            window.defence = !window.defence;
            console.log('Defence set to: ' + window.defence);
            window.savePreference('defence', window.defence);
        }
        // Letter 'Z' to reset zoom
        if (e.keyCode === 90) {
            window.resetZoom();
        }
        //Letter 'L' to increase length
        if (e.keyCode === 76) {
            window.changeLength(window.snake.fam + 10);
            window.changeLength(window.snake.sc + 10);
    
            console.log('Length set to: ' + window.snake.fam);
    
        }

        // Letter 'K' to decrease length
        if (e.keyCode === 75) {
                window.changeLength(window.snake.fam - 10);
                window.changeLength(window.snake.sc - 10);
                console.log('Length set to: ' + window.snake.fam);
    
        }
        // Letter 'H' to toggle leaderboard
        if (e.keyCode === 72) {
            window.hideLeaderboard = !window.hideLeaderboard;
            console.log('Leaderboard hidden set to: ' + window.hideLeaderboard);
            window.savePreference('hideLeaderboard', window.hideLeaderboard);
            var leaderboardElements = document.querySelectorAll('.nsi[style*="right: 4px"], .nsi[style*="right: 64px"], .nsi[style*="right: 230px"]');
            for (var i = 0; i < leaderboardElements.length; i++) {
                leaderboardElements[i].style.display = window.hideLeaderboard ? 'none' : 'block';
            }
        }
    }
};
// Snake width
window.getSnakeWidth = function() {
    return window.snake.sc * 15 * window.getScale();
};
// Sorting function for food, from property 'distance'
window.sortFood = function(a, b) {
    // a.sz & b.sz - size
    // Divide distance by size so bigger food is prioritised over smaller food
    return a.distance / a.sz - b.distance / b.sz;
};
// Sorting function for prey, from property 'distance'
window.sortPrey = function(a, b) {
    return a.distance - b.distance;
};

// Convert object coordinates to radians
window.getAngleFromObject = function(object) {
    var x = object.xx - window.getX();
    var y = object.yy - window.getY();
    return Math.atan2(x, y);
};

// Polar angle to Cartesian angles
window.getCoordsFromAngle = function(angle) {
    var x = Math.cos(angle) * 100;
    var y = Math.sin(angle) * 100;
    return [x, y];
};

// Given an object (of which properties xx and yy are not null), return the object with an additional property 'distance'
window.getDistanceFromMe = function(point) {
    if (point === null) return null;
    point.distance = window.getDistance(window.getX(), window.getY(), point.xx, point.yy);
    return point;
};
// Get a distance from point (x1; y1) to point (x2; y2).
window.getDistance = function(x1, y1, x2, y2) {
    // Calculate the vector coordinates.
    var xDistance = (x1 - x2);
    var yDistance = (y1 - y2);
    // Get the absolute value of each coordinate
    xDistance = xDistance < 0 ? xDistance * -1 : xDistance;
    yDistance = yDistance < 0 ? yDistance * -1 : yDistance;
    //Add the coordinates of the vector to get a distance. Not the real distance, but reliable for distance comparison.
    var distance = xDistance + yDistance;
    // Real distance but not needed. Here for reference -
    // var distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    return distance;
};
// Checks to see if you are going to collide with anything in the collision detection radius
window.checkCollision = function(x, y, r) {
    var circle1 = collisionScreenToCanvas({
        x: x,
        y: y,
        radius: r
    });
    if (window.visualDebugging) {
        window.drawDot(circle1.x, circle1.y, circle1.radius, 'blue', false);
    }
    var avoid = false;
    var circle2;

    for (var snake in window.snakes) {
        if (window.snakes[snake].nk != window.snake.nk) {
            for (var y = window.snakes[snake].pts.length - 1; 0 <= y; y--) {
                if (!window.snakes[snake].pts[y].dying) {
                    circle2 = {
                        x: window.snakes[snake].pts[y].xx + window.snakes[snake].fx,
                        y: window.snakes[snake].pts[y].yy + window.snakes[snake].fy,
                        radius: 15 * window.snakes[snake].sc * window.getScale()
                    };
                    if (window.circleIntersect(circle1, collisionScreenToCanvas(circle2))) {
							window.changeGoalCoords(circle2);
							avoid = true;
                    }
                }
            }
        }
    }
	
	return avoid;
};
// Screen to Canvas coordinate conversion - used for collision detection
window.collisionScreenToCanvas = function(circle) {
    var newCircle = window.mapToMouse(circle.x, circle.y);
    newCircle = window.mouseToScreen(newCircle[0], newCircle[1]);
    newCircle = window.screenToCanvas(newCircle[0], newCircle[1]);

    return {
        x: newCircle[0],
        y: newCircle[1],
        radius: circle.radius
    };
};
// Change direction
window.changeGoalCoords = function(circle1) {
	if ((circle1.x != window.collisionPoint.x && circle1.y != window.collisionPoint.y)) {
		window.collisionPoint = circle1;
		window.goalCoordinates = window.mapToMouse(window.snake.xx + (window.snake.xx - window.collisionPoint.x), window.snake.yy + (window.snake.yy - window.collisionPoint.y));
		window.setAcceleration(0);
		window.setMouseCoordinates(goalCoordinates[0], goalCoordinates[1]);
	}
};
// Check if circles intersect
window.circleIntersect = function(circle1, circle2) {
    if (quickCollisionCheck(circle1, circle2)) {
        if (collisionCheck(circle1, circle2)) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};
// Quickly check if we are going to collide with anything
window.quickCollisionCheck = function(circle1, circle2) {
    return (circle1.x + circle1.radius + circle2.radius > circle2.x &&
        circle1.x < circle2.x + circle1.radius + circle2.radius &&
        circle1.y + circle1.radius + circle2.radius > circle2.y &&
        circle1.y < circle2.y + circle1.radius + circle2.radius);
};
// Collision check
window.collisionCheck = function(circle1, circle2) {
    distance = Math.sqrt(((circle1.x - circle2.x) * (circle1.x - circle2.x)) + ((circle1.y - circle2.y) * (circle1.y - circle2.y)));

    if (distance < circle1.radius + circle2.radius) {
        collisionPointX = ((circle1.x * circle2.radius) + (circle2.x * circle1.radius)) / (circle1.radius + circle2.radius);
        collisionPointY = ((circle1.y * circle2.radius) + (circle2.y * circle1.radius)) / (circle1.radius + circle2.radius);

        if (window.visualDebugging) {
            window.drawDot(collisionPointX, collisionPointY, circle2.radius, 'cyan', true);
            window.drawDot(circle2.x, circle2.y, circle2.radius, 'red', true);
        }
        return true;
    } else {
        return false;
    }
};

// Sort food based on distance
window.getSortedFood = function() {
    // Filters the nearest food by getting the distance
    return window.foods.filter(function(val) {
        return val !== null;
    }).map(window.getDistanceFromMe).sort(window.sortFood);
};
// Sort prey based on distance
window.getSortedPrey = function() {
    // Filters the nearest food by getting the distance
    return window.preys.filter(function(val) {
        return val !== null;
    }).map(window.getDistanceFromMe).sort(window.sortPrey);
};
// Draw dots on the canvas
window.drawDot = function(x, y, radius, colour, fill) {
    var context = window.mc.getContext('2d');
    context.beginPath();
    context.strokeStyle = '#00FF00';
    context.arc(x, y, radius * window.getScale(), 0, Math.PI * 2);
    context.closePath();
    if (fill) {
        context.fillStyle = ('green red white yellow black cyan blue'.indexOf(colour) < 0) ? 'white' : colour;
        context.fill();
        context.fillStyle = 'black';
    }
};

// Draw lines on the canvas
window.drawLine = function(x2, y2, colour) {
    var context = window.mc.getContext('2d');
    var center = [window.mc.height / 2, window.mc.width / 2];
    context.lineWidth = 5 * window.getScale();
    context.strokeStyle = (colour === 'green') ? '#00FF00' : '#FF0000';
    context.moveTo(center[1], center[0]);
    context.lineTo(x2, y2);
    context.stroke();
    context.strokeStyle = '#000000';
};
// Save the original slither.io oef function so we can add things to it later
window.oldOef = window.oef;
window.oef = function() {
    // Original slither.io oef function + whatever is under it
    // requestAnimationFrame(window.loop);
    window.oldOef();
    if (window.isBotRunning) window.loop();
    window.onFrameUpdate();
};
window.handleTextColor = function(enabled) {
    return '<span style=\"opacity: 0.8; color:' + (enabled ? 'green;\">enabled' : 'red;\">disabled') + '</span>';
};
window.onFrameUpdate = function() {
    // Botstatus overlay
    var generalStyle = '<span style = "opacity: 0.35";>';
    window.botstatus_overlay.innerHTML = generalStyle + '(T) Bot: </span>' + window.handleTextColor(window.isBotRunning);
    window.visualdebugging_overlay.innerHTML = generalStyle + '(Y) Visual debugging: </span>' + window.handleTextColor(window.visualDebugging);
    window.logdebugging_overlay.innerHTML = generalStyle + '(U) Log debugging: </span>' + window.handleTextColor(window.logDebugging);
    window.autorespawn_overlay.innerHTML = generalStyle + '(I) Auto respawning: </span>' + window.handleTextColor(window.autoRespawn);
    window.rendermode_overlay.innerHTML = generalStyle + '(O) Mobile rendering: </span>' + window.handleTextColor(window.mobileRender);
    window.huntprey_overlay.innerHTML = generalStyle + '(P) Prey hunting: </span>' + window.handleTextColor(window.huntPrey);
    window.collision_detection_overlay.innerHTML = generalStyle + '(C) Collision detection: </span>' + window.handleTextColor(window.collisionDetection);
    window.collision_radius_multiplier_overlay.innerHTML = generalStyle + '(A/S) Collision radius multiplier: ' + window.collisionRadiusMultiplier + ' </span>';
    window.defence_overlay.innerHTML = generalStyle + '(D) Defence: </span>' + window.handleTextColor(window.defence);
    window.resetzoom_overlay.innerHTML = generalStyle + '(Z) Reset zoom </span>';
    window.length_overlay.innerHTML = generalStyle + '(L/K) Length Hack: ' + window.changeLength.length + '</span>';
    window.hideleaderboard_overlay.innerHTML = generalStyle + '(H) Hide leaderboard: </span>' + window.handleTextColor(window.hideLeaderboard);
    window.fps_overlay.innerHTML = generalStyle + 'FPS: ' + window.framesPerSecond.getFPS() + '</span>';
    

    // If playing
    if (window.playing && window.visualDebugging) {
        if (window.isBotRunning) {
            // Check to see if there is a position overlay
            if (window.position_overlay) {
                // Display the X and Y of the snake
                window.position_overlay.innerHTML = generalStyle + 'X: ' + (Math.round(window.snake.xx) || 0) + ' Y: ' + (Math.round(window.snake.yy) || 0) + '</span>';
            }
            drawGoalCoordinates = window.mouseToScreen(window.goalCoordinates[0], window.goalCoordinates[1]);
            drawGoalCoordinates = window.screenToCanvas(drawGoalCoordinates[0], drawGoalCoordinates[1]);
            window.drawLine(drawGoalCoordinates[0], drawGoalCoordinates[1], 'green');
            window.drawDot(drawGoalCoordinates[0], drawGoalCoordinates[1], 5, 'red', true);
        }
    }
};
// Defense mode - bot turns around in a circle
window.playDefence = function(dir) {    
    window.kd_l = (dir === "l");
    window.kd_r = (dir === "r");
    window.setMouseCoordinates(window.getWidth() / 2, window.getHeight() / 2);
};
// Actual bot code

// Loop for running the bot
window.loop = function() {
    // If the game and the bot are running
    if (window.playing && window.isBotEnabled) {
        window.ranOnce = true;
        // TODO: Check some condition to see if we should play defence
        // Right now this just uses the manual toggle
        if (window.defence) {
            window.playDefence("l");
            return;
        }
		
        // If no enemies or obstacles, go after what you are going after
        if ((!window.checkCollision(window.getX(), window.getY(), window.getSnakeWidth()*window.collisionRadiusMultiplier)) && window.huntPrey) {
            // Sort the food based on their distance relative to player's snake
            window.sortedFood = window.getSortedFood();
            // Current food
            window.currentFood = window.sortedFood[0];
            // Convert coordinates of the closest food using mapToMouse
            var coordinatesOfClosestFood = window.mapToMouse(window.currentFood.xx, window.currentFood.yy);
            window.goalCoordinates = coordinatesOfClosestFood;
            // Disable Sprint
            window.setAcceleration(0);
            // Check for preys, enough "length"
            if (window.preys.length > 0) {
                // Sort preys based on their distance relative to player's snake
                window.sortedPrey = window.getSortedPrey();
                // Current prey
                window.currentPrey = window.sortedPrey[0];
                // Convert coordinates of the closest prey using mapToMouse
                var coordinatesOfClosestPrey = window.mapToMouse(window.currentPrey.xx, window.currentPrey.yy);
                // Check for the distance
                if (window.currentPrey.distance <= Math.pow(window.getSnakeLength(), 2) / 2) {
                    // Set the mouse coordinates to the coordinates of the closest prey
                    window.goalCoordinates = coordinatesOfClosestPrey;
                    // "Sprint" enabled
                    window.setAcceleration(1);
                }
            }
            window.kd_l = false;
            window.kd_r = false;
            window.setMouseCoordinates(window.goalCoordinates[0], window.goalCoordinates[1]);
        }
	if (!window.defence && !window.huntPrey){
		//continue what is being done
		window.setMouseCoordinates(mouseCoords.x - (innerWidth / 2), mouseCoords.y - (innerHeight / 2));
	}
    } else {
        if (window.ranOnce) {
            //window.startInterval = setInterval(window.startBot, 1000);
            window.stopBot();
        }
    }
};

// Target the user's browser.
(function() {
    var requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;

    window.requestAnimationFrame = requestAnimationFrame;
})();

// Starts bot
window.startBot = function() {
    if (window.autoRespawn && !window.playing && window.isBotEnabled && window.ranOnce && !window.isBotRunning) {
        window.connectBot();
        //clearInterval(window.startInterval);
    }
};
// Initialises the bot
window.initBot = function() {
    window.ranOnce = false;
    window.isBotRunning = false;
    window.isBotEnabled = true;
    window.collisionPoint = {
        x: 0,
        y: 0,
        radius: 0
    };
    // Load preferences
    window.loadPreference('logDebugging', false);
    window.loadPreference('visualDebugging', false);
    window.loadPreference('autoRespawn', false);
    window.loadPreference('mobileRender', false);
    window.loadPreference('huntPrey', true);
    window.loadPreference('collisionDetection', true);
    window.loadPreference('collisionRadiusMultiplier', 8);
    window.loadPreference('defence', false);
    window.loadPreference('hideLeaderboard', false);
    window.nick.value = window.loadPreference('savedNick', '');
    // Overlays
    // Top left
    window.generalstyle = 'color: #FFF; font-family: Arial, \'Helvetica Neue\', Helvetica, sans-serif; font-size: 14px; position: fixed; z-index: 7;';
    window.appendDiv('botstatus_overlay', 'nsi', window.generalstyle + 'left: 30; top: 30px;');
    window.appendDiv('visualdebugging_overlay', 'nsi', window.generalstyle + 'left: 30; top: 45px;');
    window.appendDiv('logdebugging_overlay', 'nsi', window.generalstyle + 'left: 30; top: 60px;');
    window.appendDiv('autorespawn_overlay', 'nsi', window.generalstyle + 'left: 30; top: 75px;');
    window.appendDiv('rendermode_overlay', 'nsi', window.generalstyle + 'left: 30; top: 90px;');
    window.appendDiv('huntprey_overlay', 'nsi', window.generalstyle + 'left: 30; top: 105px;');
    window.appendDiv('collision_detection_overlay', 'nsi', window.generalstyle + 'left: 30; top: 120px;');
    window.appendDiv('collision_radius_multiplier_overlay', 'nsi', window.generalstyle + 'left: 30; top: 135px;');
    window.appendDiv('defence_overlay', 'nsi', window.generalstyle + 'left: 30; top: 150px;');
    window.appendDiv('resetzoom_overlay', 'nsi', window.generalstyle + 'left: 30; top: 165px;');
    window.appendDiv('length_overlay', 'nsi', window.generalstyle + 'left: 30; top: 180px;');
    window.appendDiv('hideleaderboard_overlay', 'nsi', window.generalstyle + 'left: 30; top: 195px;');
    // Bottom right
    window.appendDiv('position_overlay', 'nsi', window.generalstyle + 'right: 30; bottom: 120px;');
    // Top right
    window.appendDiv('fps_overlay', 'nsi', window.generalstyle + 'right: 255; top: 25px;');
    if (window.playing) {
        // Listener for mouse wheel scroll - used for setZoom function
        window.addEventListener('mousewheel', window.setZoom);
        window.addEventListener('DOMMouseScroll', window.setZoom);
    } else {
        // If the game hasn't started, wait for it to start and then add the event listeners
        var intervalId = setInterval(function() {
            if (window.playing) {
                clearInterval(intervalId);
                window.addEventListener('mousewheel', window.setZoom);
                window.addEventListener('DOMMouseScroll', window.setZoom);
            }
        }, 100);
    }
    // Set render mode
    if (window.mobileRender) {
        setBackground('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs');
        window.render_mode = 1;
    } else {
        setBackground();
        window.render_mode = 2;
    }
    // Canvas Ratio
    window.canvasRatio = [window.mc.width / window.getWidth(), window.mc.height / window.getHeight()];
    // Unblocks all skins without the need for FB sharing.
    window.localStorage.setItem('edttsg', '1');
    // Remove social
    window.social.remove();
    // Start!
    window.launchBot(50);
};
window.initBot();
