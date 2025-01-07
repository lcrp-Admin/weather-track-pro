const faqData = [
    {
        question: "How accurate is the weather data?",
        answer: "Our weather data is sourced from reliable meteorological services and is typically accurate within a reasonable margin."
    },
    {
        question: "Why isn't my city showing up?",
        answer: "Make sure you're spelling the city name correctly. Try including the country name if there are multiple cities with the same name."
    },
    {
        question: "How often is the weather data updated?",
        answer: "Weather data is updated every 10 minutes to ensure you have the most current information."
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // Initialize FAQ section
    const faqContainer = document.querySelector('.faq-items');
    faqData.forEach(faq => {
        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item';
        faqItem.innerHTML = `
            <div class="faq-question">${faq.question}</div>
            <div class="faq-answer">${faq.answer}</div>
        `;
        faqContainer.appendChild(faqItem);
    });

    // Add FAQ toggle functionality
    document.querySelectorAll('.faq-item').forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });

    // Handle support form submission
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.addEventListener('click', handleSubmit);
});

function handleSubmit() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const issueType = document.getElementById('issue-type').value;
    const message = document.getElementById('message').value;

    if (!name || !email || !issueType || !message) {
        alert('Please fill in all fields');
        return;
    }

    // Here you would typically send this data to a backend server
    alert('Support ticket submitted successfully! We will contact you soon.');
    
    // Clear form
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('issue-type').value = '';
    document.getElementById('message').value = '';
}