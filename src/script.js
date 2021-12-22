import { paper } from "paper";
import { words } from "./words";

const canvas = document.querySelector('#canvas');
// paper.install(window);
paper.setup(canvas);

// settings
const MIN_WORDS = 2;
const MAX_WORDS = 7;
const DOT_RADIUS = 3;
const MARGINS = 100;

// some global variables
const wordCount = getRandomArbitrary(MIN_WORDS-1, MAX_WORDS);
let path = new paper.Path();
let selectedWords = [];
let points = [];

function init() {
    // render the canvas
    render();
    
    // add event listeners
    document.getElementById("download-to-svg").onclick = function() {
        downloadSVG();
    }
    // document.querySelector("button#refresh").onclick = function() {
    //     render();
    // }
}

function render() {
    // if there is already a drawing, remove it

    // set stroke color
    path.strokeColor = 'black';

    // select some random words
    for (let i = 0; i <= wordCount; i++) {
        let word = words.splice(Math.floor(Math.random() * words.length), 1)
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

    points.forEach((point, i) => {
        // add text to the dots
        let text = new paper.PointText(point.subtract(new paper.Point(0, 10)));
        text.content = selectedWords[i];
        positionText(text, point);
    })
}

function positionText(text, point) {
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
    let fileName = `${selectedWords.join('-')}.svg`;
    let url = "data:image/svg+xml;utf8," + encodeURIComponent(paper.project.exportSVG({asString:true}));
    let link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.click();
}

document.addEventListener('DOMContentLoaded', () => {
    init();
})