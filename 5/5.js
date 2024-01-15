var rotationModeEnabled = false;

function allowDrop(e) {
    e.preventDefault();
}

function setRotationMode(e, active) {
    if (e.key == "r" || e.key == "к")
        rotationModeEnabled = active;
}

function processMouseDown(e, element) {
    var coords = getCoords(element);
    var shiftX = e.pageX - coords.left;
    var shiftY = e.pageY - coords.top;

    element.style.zIndex = 100;

    if (rotationModeEnabled)
    {
        var previousAngle = Number(element.style.rotate.replace("deg", ""));
        rotateElement(element, e.pageY, previousAngle);
    }
    else
        processDragNDrop(e, element, shiftX, shiftY);
}

function rotateElement(element, initialY, initialAngle) {
    function rotate(e) {
        var angle = initialAngle + (e.pageY - initialY);
        element.style.rotate =  angle + "deg";
    }

    document.onmousemove = function(e) {
        rotate(e);
    };
  
    document.onmouseup = function() {
        console.log(getCoords(element));
        element.style.zIndex = 0;

        document.onmousemove = null;
        document.onmouseup = null;
    };
}

function processDragNDrop(e, element, shiftX, shiftY) {  
    moveAt(e);

    function moveAt(e) {
        var newLeft = e.pageX - shiftX; 
        var newTop = e.pageY - shiftY;

        if (newLeft < 0)
            newLeft = 0;
        else if (newLeft + element.clientWidth > document.documentElement.clientWidth)
            newLeft = document.documentElement.clientWidth - element.clientWidth;

        if (newTop < 0)
            newTop = 0;
        else if (newTop + element.clientHeight > document.documentElement.clientHeight)
            newTop = document.documentElement.clientHeight - element.clientHeight; 

        element.style.left = newLeft + 'px';
        element.style.top = newTop + 'px';
    }
  
    document.onmousemove = function(e) {
        moveAt(e);
    };
  
    document.onmouseup = function() {
        element.style.zIndex = 0;

        document.onmousemove = null;
        document.onmouseup = null;

        if (checkGroupedCorrectly())
            setAnimation();
    };
}
  
function avoidDefault(e) {
    e.preventDefault();
}
  
function getCoords(element) {
    var box = element.getBoundingClientRect();
    return {
        top: box.top + scrollY,
        left: box.left + scrollX
    };
}

function checkGroupedCorrectly() {
    var groups = getImagesGroups();

    for (var group of groups) {
        for (var i = 0; i < group.length - 1; i++) {
            for (var j = i + 1; j < group.length; j++) { 
                var firstCoords = getElementCenterCoords(group[i]);
                var secondCoords = getElementCenterCoords(group[j]);

                if (getDistance(firstCoords, secondCoords) > 150)
                    return false;
            }
        }
    }

    var groupCentersCoords = [];
    for (var i = 0; i < groups.length; i++)
        groupCentersCoords[i] = getGroupCenterCoords(groups[i]);

    for (var i = 0; i < groups.length - 1; i++) {
        for (var j = i + 1; j < groups.length; j++) {             
            if (getDistance(groupCentersCoords[i], groupCentersCoords[j]) < 300)
                return false;
        }
    }

    return true;
}

function getImagesGroups() {
    var cat = document.getElementById("cat");
    var dog = document.getElementById("dog");

    var hen = document.getElementById("hen");
    var parrot = document.getElementById("parrot");

    var dragonfly = document.getElementById("dragonfly");
    var grasshopper = document.getElementById("grasshopper");
    var ladybug = document.getElementById("ladybug");
    
    return [[cat, dog], [hen, parrot], [dragonfly, grasshopper, ladybug]];
}

function getGroupCenterCoords(group) {
    var x = 0;
    var y = 0;

    for (var i = 0; i < group.length; i++)
    {
        var centerCoords = getElementCenterCoords(group[i]);
        x += centerCoords.x;
        y += centerCoords.y;
    }

    return {
        x: x / group.length,
        y: y / group.length
    }
}

function getDistance(firstCoords, secondCoords) {
    return Math.sqrt(Math.pow(firstCoords.x - secondCoords.x, 2) + Math.pow(firstCoords.y - secondCoords.y, 2));
}

function getElementCenterCoords(element) {
    var rect = getCoords(element);

    return {
        x: rect.left + element.clientWidth / 2,
        y: rect.top + element.clientHeight / 2,
    };
}

function setAnimation() {
    for (var element of document.getElementsByTagName("img"))
    {
        element.className = "animated";
        element.onanimationend = function(e) { e.target.className = null; }
    }
}