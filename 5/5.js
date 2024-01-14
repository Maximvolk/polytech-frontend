function allowDrop(e) {
    e.preventDefault();
}

function processDragNDrop(e, element) {
    var coords = getCoords(element);
    var shiftX = e.pageX - coords.left;
    var shiftY = e.pageY - coords.top;
  
    moveAt(e);
  
    function moveAt(e) {
        element.style.left = e.pageX - shiftX + 'px';
        element.style.top = e.pageY - shiftY + 'px';
    }
  
    document.onmousemove = function(e) {
        moveAt(e);
    };
  
    element.onmouseup = function() {
        document.onmousemove = null;
        element.onmouseup = null;

        if (checkGroupedCorrectly())
            alert("Correct!");
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
    for (var group of getImagesGroups()) {
        for (var i = 0; i < group.length - 1; i++) {
            for (var j = i + 1; j < group.length; j++) {
                var firstRect = getCoords(group[i]);
                var secondRect = getCoords(group[j]);
                
                console.log(firstRect.left - secondRect.left);
                if (Math.abs(firstRect.left - secondRect.left) > 15)
                    return false;

                if (Math.abs(firstRect.top - secondRect.top) > 15)
                    return false;
            }
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

function getDistance(firstOffset, secondOffset) {
    console.log(firstOffset);
    var first = Number(firstOffset.slice(0, -2));
    var second = Number(secondOffset.slice(0, -2));

    return Math.abs(first - second);
}