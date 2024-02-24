console.log(faceapi)

//facial detection
const run = async () => {
    //we need to load our models
    //loading the models is going to use await
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.ageGenderNet.loadFromUri('./models'),
    ])

    // const face = await faceapi.fetchImage('url link of the image ') //if we want to use link otherwise below method
    const face = document.getElementById('face');
    //we grab the image ,and hand it is detectAllFaces method
    let faceAIData = await faceapi.detectAllFaces(face).withFaceLandmarks().withFaceDescriptors().withAgeAndGender();
    // console.log(faceAIData);

    //Get the canvas and set up on top of the image
    // and make it same size 
    const canvas = document.getElementById('canvas');
    canvas.style.left = face.offsetLeft;
    canvas.style.top = face.offsetTop;
    canvas.height = face.height;
    canvas.width = face.width;

    //let draw our bounding box on our face/image
    faceAIData = faceapi.resizeResults(faceAIData, face);
    // console.log(faceAIData);
    faceapi.draw.drawDetections(canvas, faceAIData);


    //Ask to AI to guess the age and gender
    faceAIData.forEach(face => {
        const { age, gender, genderProbability } = face;
        const genderText = `${gender}-${genderProbability}`
        const ageText = `${Math.round(age)} years`
        const textField = new faceapi.draw.DrawTextField([genderText, ageText], face.detection.box.bottomLeft);
        textField.draw(canvas);
    });

    //face recognisation:check to see if one face matches another face

}

run()