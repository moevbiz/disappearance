import { paper } from "paper";
import { words } from "./resource/words";

const canvas = document.querySelector('#canvas');
canvas.style.width = '100%';
canvas.style.height = '100%';
paper.setup(canvas);

// settings
const MIN_WORDS = 2;
const MAX_WORDS = 7;
const DOT_RADIUS = 3;
const MARGINS = 100;

// some global variables
let selectedWords;
let hasBeenInitialised = false;

function init() {
    render();
    
    // add event listeners
    document.getElementById("download-to-svg").onclick = function() {
        downloadSVG();
    }
    document.querySelector("button#refresh").onclick = function() {
        render();
    }

    hasBeenInitialised = true;
}

function render() {
    // duplicate words array to manipulate it
    let wordsDupe = [...words];

    // max # of words
    let wordCount = getRandomArbitrary(MIN_WORDS-1, MAX_WORDS);

    // reset stuff
    let points = [];
    selectedWords = [];

    // if there is already a drawing, remove it
    if (hasBeenInitialised) {
        paper.project.activeLayer.removeChildren();
    }

    // make path
    let path = new paper.Path();
    path.strokeColor = 'black';

    // select some random words
    for (let i = 0; i <= wordCount; i++) {
        let word = wordsDupe.splice(Math.floor(Math.random() * wordsDupe.length-1), 1)
        selectedWords.push(word);
    }

    selectedWords.forEach((word, i) => {
        // create a new dot coordinate
        let point = new paper.Point(
            getRandomArbitrary(MARGINS, paper.view.viewSize.width - MARGINS),
            getRandomArbitrary(MARGINS, paper.view.viewSize.height - MARGINS)
        );
        // store  in array
        points.push(point);
    })

    // choose random segment to make curve from
    let indexOfSegmentWithArc = getRandomInt(points.length);

    points.forEach((point, i) => {
        // create the dots
        let dot = new paper.Path.Circle(point, DOT_RADIUS);
        dot.fillColor = 'black';

        // calculate the curve
        let x = getRandomArbitrary(-200, 200);
        let y = getRandomArbitrary(-200, 200);
        let p = new paper.Point(x, y);

        // create the segment
        let segment = new paper.Segment(
            point,
            // make curve?
            i == indexOfSegmentWithArc + 1 ? p : null,
            i == indexOfSegmentWithArc ? p : null,
        );

        // add the segment to the path
        path.add(segment)
    })

    // add text to the dots
    points.forEach((point, i) => {
        let text = new paper.PointText(point.subtract(new paper.Point(0, 10)));
        text.content = selectedWords[i];
        positionText(text, point, path);
    })
}

function positionText(text, point, path) {
    text.justification = 'center';

    // try positioning bottom of dot
    if (text.intersects(path)) {
        text.position = point.add(0, 15);
    }
    // try positioning right of dot
    if (text.intersects(path)) {
        text.position = point.add(10, 0);
        text.justification = 'left';
    }
    // try positioning left of dot
    if (text.intersects(path)) {
        text.justification = 'right';
        text.position = text.position.subtract(20, 0);
    }
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function downloadSVG() {
    let fileName = selectedWords.join('-') + ".svg";
    let url = "data:image/svg+xml;utf8," + encodeURIComponent(paper.project.exportSVG({asString:true}));
    let link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.click();
}

document.addEventListener('DOMContentLoaded', () => {
    init();
})