# Face Recognization (face-recognization.js):

### `$.` This line simply logs the faceapi object to the console. It's often used for debugging purposes to inspect the contents of an object.
```

console.log(faceapi);

```

### `$.` Defines an asynchronous function called `run`.
```

const run = async () => {

```

### `$.` Loads multiple neural network models using await Promise.all. These models include the SSD MobileNet V1, face landmark detection model, face recognition model, and age-gender detection model. These models are used for different stages of face recognition.

```

//we need to load our models
//loading the models is going to use await
await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.ageGenderNet.loadFromUri('./models'),
])

```

### `$.` Fetches two images from URLs: Reface is an image of Michael Jordan, and facesToCheck is an image that you want to check for faces.
```

// Reface =We khow this is Mical jordan

const Reface = await faceapi.fetchImage("https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Michael_Jordan_in_2014.jpg/220px-Michael_Jordan_in_2014.jpg");


// facesToCheck=which we want to check 

const facesToCheck = await faceapi.fetchImage("https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/JordanSmithWorthy2.jpg/170px-JordanSmithWorthy2.jpg");

```

### `$.` Uses the loaded models to detect faces in both the reference image (Reface) and the image to check (facesToCheck). It also extracts face landmarks and descriptors for further comparison
```

//we grab the reference image ,and hand it is detectAllFaces method

let refAIData = await faceapi.detectAllFaces(Reface).withFaceLandmarks().withFaceDescriptors();
let facesToCheckAIData = await faceapi.detectAllFaces(facesToCheck).withFaceLandmarks().withFaceDescriptors();

```

### `$.` Gets a reference to the HTML canvas element with the ID 'canvas' and matches its dimensions to the dimensions of the image to check (facesToCheck). This step is important for accurate drawing of the detected faces on the canvas.

```

//Get the canvas and set up on top of the image
// and make it same size 

const canvas = document.getElementById('canvas');
faceapi.matchDimensions(canvas, facesToCheck);

```

### `$.` Creates a FaceMatcher instance using the reference AI data (refAIData) and resizes the results of face detection on the image to check (facesToCheckAIData) to match the dimensions of the image.

```

// we need to make a face matcher 
// Fathcmathcer is a constructor in faceapi
//we hand it our referece AI data
// let faceMatcher = new faceapi.faceMatcher(refAIData);

let faceMatcher = new faceapi.FaceMatcher(refAIData);
facesToCheckAIData = faceapi.resizeResults(facesToCheckAIData, facesToCheck);

```

### `$.` Iterates through each detected face in the image to check, compares it with the reference data using the FaceMatcher, and draws a box around the face on the canvas. If the label includes "unknown," it skips drawing the box.

```

//loop through all of the faces in our imageToCheck and compare to our refence data


facesToCheckAIData.forEach(face => {
    const { detection, descriptor } = face;
    //make a label ,using the default
    let label = faceMatcher.findBestMatch(descriptor).toString();

    // console.log(label);

    if (label.includes("unknown")) {
        return;
    }

    const options = { label: "Jhordan" };
    const drawbox = new faceapi.draw.DrawBox(detection.box, options);
    drawbox.draw(canvas);
});


```




# Facial Detection (scripts.js):

### `$.` This line simply logs the faceapi object to the console. It's often used for debugging purposes to inspect the contents of an object.
```

console.log(faceapi);

```

### `$.` Defines an asynchronous function called `run`.
```

const run = async () => {

```

### `$.` Loads multiple neural network models using await Promise.all. These models include the SSD MobileNet V1, face landmark detection model, face recognition model, and age-gender detection model. These models are used for different stages of face recognition.

```

//we need to load our models
//loading the models is going to use await
await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.ageGenderNet.loadFromUri('./models'),
])

```

### `$.` Fetches the image from the DOM with the ID 'face'. This assumes there is an HTML element with the ID 'face' containing an image.
```

// const face = await faceapi.fetchImage('url link of the image ') //if we want to use link otherwise below method
const face = document.getElementById('face');


```

### `$.` Uses the loaded models to detect faces in the specified image (face). It also extracts face landmarks, descriptors, age, and gender information for each detected face.
```

// const face = await faceapi.fetchImage('url link of the image ') //if we want to use link otherwise below method

let faceAIData = await faceapi.detectAllFaces(face).withFaceLandmarks().withFaceDescriptors().withAgeAndGender();


```

### `$.` Gets a reference to the HTML canvas element with the ID 'canvas'. Adjusts the canvas position and dimensions to match the position and dimensions of the face image.

```
//Get the canvas and set up on top of the image
// and make it same size 

const canvas = document.getElementById('canvas');
canvas.style.left = face.offsetLeft;
canvas.style.top = face.offsetTop;
canvas.height = face.height;
canvas.width = face.width;


```

### `$.` Resizes the results of face detection to match the dimensions of the face image. This is necessary for accurate drawing on the canvas.

```

//let draw our bounding box on our face/image

faceAIData = faceapi.resizeResults(faceAIData, face);

```

### `$.` Draws bounding boxes around the detected faces on the canvas.

```

faceapi.draw.drawDetections(canvas, faceAIData);


```


### `$.` Iterates through each detected face, extracts age and gender information, and draws a text field with gender and age information at the bottom-left corner of each face bounding box on the canvas.

```

//Ask to AI to guess the age and gender
faceAIData.forEach(face => {
    const { age, gender, genderProbability } = face;
    const genderText = `${gender}-${genderProbability}`
    const ageText = `${Math.round(age)} years`
    const textField = new faceapi.draw.DrawTextField([genderText, ageText], face.detection.box.bottomLeft);
    textField.draw(canvas);
});


```


