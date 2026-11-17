/*
This function is inserted in the head section of the website. It's to check if any XSS cross site scripting is taking place via the URL
*/
function urlSanitise() {
    if (typeof window !== 'undefined') {
        let urlLocation = window.location.toString();
        let threats = 0;
        const maliciousTerms = ['%3Cscript', '%3C/script'];

        maliciousTerms.forEach(function(term) {
            let found = urlLocation.indexOf(term);

            if (found > 0) {
                urlLocation = urlLocation.slice(0, found);
                threats += 1;
            }
        });

        threats > 0 ? (window.location.href = urlLocation) : null;
    }
}

urlSanitise();