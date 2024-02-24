console.log(faceapi)

//facial recognization
const run = async () => {
    //we need to load our models
    //loading the models is going to use await
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.ageGenderNet.loadFromUri('./models'),
    ])

    //if we want to use link then we use the below method
    // Reface =We khow this is Mical jordan
    const Reface = await faceapi.fetchImage("https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Michael_Jordan_in_2014.jpg/220px-Michael_Jordan_in_2014.jpg")

    // facesToCheck=which we want to check 
    const facesToCheck = await faceapi.fetchImage("https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/JordanSmithWorthy2.jpg/170px-JordanSmithWorthy2.jpg")


    //we grab the reference image ,and hand it is detectAllFaces method
    let refAIData = await faceapi.detectAllFaces(Reface).withFaceLandmarks().withFaceDescriptors();
    let facesToCheckAIData = await faceapi.detectAllFaces(facesToCheck).withFaceLandmarks().withFaceDescriptors();
    // console.log(faceAIData);

    //Get the canvas and set up on top of the image
    // and make it same size 
    const canvas = document.getElementById('canvas');
    faceapi.matchDimensions(canvas, facesToCheck);


    // we need to make a face matcher 
    // Fathcmathcer is a constructor in faceapi
    //we hand it our referece AI data
    // let faceMatcher = new faceapi.faceMatcher(refAIData);
    let faceMatcher = new faceapi.FaceMatcher(refAIData);
    facesToCheckAIData = faceapi.resizeResults(facesToCheckAIData, facesToCheck);

    //loop through all of the faces in our imageToCheck and compare to our refence data
    facesToCheckAIData.forEach(face => {
        const { detection, descriptor } = face;
        //make a label ,using the default
        let label = faceMatcher.findBestMatch(descriptor).toString()
        // console.log(label);

        if (label.includes("unknown")) {
            return;
        }

        const options = { label: "Jhordan" };
        const drawbox = new faceapi.draw.DrawBox(detection.box, options);
        drawbox.draw(canvas);
    });

}

run()