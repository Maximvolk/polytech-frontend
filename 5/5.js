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
    };
};
  
function avoidDefault(e) {
    e.preventDefault();
};
  
function getCoords(element) {
    var box = element.getBoundingClientRect();
    return {
        top: box.top + scrollY,
        left: box.left + scrollX
    };
}