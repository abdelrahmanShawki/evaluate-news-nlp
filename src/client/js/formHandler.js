import { checkForURL } from './urlChecker';

async function handleSubmit(event) {
    event.preventDefault();
    
    const formText = document.getElementById('name').value;
    
    if (!checkForURL(formText)) {
        alert("Please enter a valid URL.");
        return;
    }

    console.log("::: Form Submitted :::");

    // Fetch analysis from the server
    try {
        const response = await fetch('http://localhost:8000/api', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: formText })
        });

        const data = await response.json();
        console.log(data); //test
        updateUI(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

function updateUI(data) {
    const polarityTerms = data.polarity_terms.map(term => `<li>${term.text} (${term.score_tag})</li>`).join('');
    
    document.getElementById('results').innerHTML = `
        <p>Subjectivity: ${data.subjectivity}</p>
        <p>Text: ${data.text}</p>
        <p>Polarity Terms:</p>
        <ul>${polarityTerms}</ul>
    `;
}

export { handleSubmit };
