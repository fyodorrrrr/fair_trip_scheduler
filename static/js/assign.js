document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const compensationInput = document.getElementById('compensation');
    
    form.addEventListener('submit', function(e) {
        const compensation = parseFloat(compensationInput.value);
        if (isNaN(compensation) || compensation <= 0) {
            e.preventDefault();
            alert('Please enter a valid positive number for compensation');
        }
    });
});