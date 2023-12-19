async function moveOut(cancellationSource) {
    if (cancellationSource.inProgress)
        await cancel(cancellationSource);

    cancellationSource.inProgress = true;

    var box = document.getElementsByClassName('box')[0];
    var image = document.getElementById('third');

    var imageRect = image.getBoundingClientRect();
    var boxRect = box.getBoundingClientRect();

    var top = imageRect.top - boxRect.top + 100;
    var left = imageRect.left - boxRect.left - 100;

    image.style.top = `${top}px`;
    image.style.left = `${left}px`;
    image.style.visibility = 'visible';

    while (top > imageRect.top - boxRect.top) {
        // Before cancelling operation we need to return element to original position
        if (cancellationSource.cancelled)
        {
            image.style.visibility = 'hidden';
            image.style.top = `${imageRect.top - boxRect.top}px`;
            image.style.left = `${imageRect.left - boxRect.left}px`;

            cancellationSource.inProgress = false;
            return;
        }
        
        image.style.top = `${top}px`;
        image.style.left = `${left}px`;

        previousTop = top;
        top--;
        left++;

        await sleep(10);
    }
    
    document.getElementById('second').style.visibility = 'visible';
    cancellationSource.inProgress = false;
}

async function disappear(cancellationSource) {
    if (cancellationSource.inProgress)
        await cancel(cancellationSource);

    document.getElementById('second').style.visibility = 'hidden';
    document.getElementById('third').style.visibility = 'hidden';
    document.getElementById('fourth').style.opacity = 0;
    document.getElementById('fifth').style.visibility = 'hidden';
}

async function appearSlowly(cancellationSource) {
    if (cancellationSource.inProgress)
        await cancel(cancellationSource);

    disappear(cancellationSource);
    cancellationSource.inProgress = true;

    var image = document.getElementById('fourth');
    var opacity = 0.0;

    while (opacity < 1) {
        if (cancellationSource.cancelled)
        {
            image.style.opacity = 0;
            cancellationSource.inProgress = false;
            return;
        }

        image.style.opacity = `${opacity}`;
        opacity += 0.01;

        await sleep(15);
    }
    
    document.getElementById('fifth').style.visibility = 'visible';
    cancellationSource.inProgress = false;
}

async function shake(cancellationSource) {
    if (cancellationSource.inProgress)
        await cancel(cancellationSource);

    cancellationSource.inProgress = true;

    var image = document.getElementById('fourth');
    var box = document.getElementsByClassName('box')[0];

    var direction = true;
    var degree = 0;
    var size = 200;

    while (true) {
        if (cancellationSource.cancelled)
        {
            image.style.transform = `rotate(0)`;
            image.style.opacity = 0;
            document.getElementById('fifth').style.visibility = 'hidden';

            box.style.height = '200px';
            box.style.width = '200px';

            cancellationSource.inProgress = false;
            return;
        }

        if (direction) {
            if (degree >= 20) {
                direction = false;
                continue;
            }

            degree++;
            size++;
        } else {
            if (degree <= -20) {
                direction = true;
                continue;
            }

            degree--;
            size--;
        }

        image.style.transform = `rotate(${degree}deg)`;
        
        box.style.height = `${size}px`;
        box.style.width = `${size}px`;

        await sleep(10);
    }
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function cancel(cancellationSource) {
    cancellationSource.cancelled = true;

    do {
        await sleep(5);
    } while (cancellationSource.inProgress);

    cancellationSource.cancelled = false;
}

$(document).ready(function() {
    var cancellationSource = {
        cancelled: false,
        inProgress: false
    };

    document.getElementsByClassName('box')[0].addEventListener('mouseenter', async () => await moveOut(cancellationSource));
    document.getElementsByClassName('box')[0].addEventListener('mouseleave', async () => await disappear(cancellationSource));
    document.getElementsByClassName('box')[0].addEventListener('mousedown', async () => {
        await appearSlowly(cancellationSource);
        await shake(cancellationSource);
    });
    document.getElementsByClassName('box')[0].addEventListener('mouseup', async () => await disappear(cancellationSource));
});