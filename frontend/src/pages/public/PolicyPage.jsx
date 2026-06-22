import React from 'react';

function PolicyPage() {
    return (
        <div className="bg-card-bg min-h-screen py-16 px-4">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-sm border border-border">
                <h1 className="font-heading text-4xl font-bold text-text-dark mb-6 text-center">
                    Privacy Policy
                </h1>
                <div className="w-16 h-1 bg-primary mx-auto mb-10"></div>
                
                <div className="space-y-8 font-body text-text-light leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-text-dark mb-3">1. Information We Collect</h2>
                        <p>
                            We collect information that you provide directly to us when you create an account, place an order,
                            apply for a job, or contact us for support. This information may include your name, email address,
                            phone number, WhatsApp number, delivery address, and payment information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-text-dark mb-3">2. How We Use Your Information</h2>
                        <p className="mb-2">We use the information we collect to:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Process and fulfill your orders, including sending you emails or WhatsApp messages to confirm your order status and shipment.</li>
                            <li>Respond to your customer service inquiries and requests for information.</li>
                            <li>Review your job applications and contact you regarding employment opportunities.</li>
                            <li>Improve our website, products, and services based on your feedback.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-text-dark mb-3">3. Data Security</h2>
                        <p>
                            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized
                            access, disclosure, alteration, and destruction. We use standard security protocols to ensure your data
                            remains secure on our servers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-text-dark mb-3">4. Third-Party Services</h2>
                        <p>
                            We may share your information with third-party service providers who need access to such information
                            to carry out work on our behalf (e.g., delivery riders, payment processors). These service providers
                            are authorized to use your personal information only as necessary to provide these services to us.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-text-dark mb-3">5. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at our main branch or via
                            our provided contact numbers on the Contact Us page.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default PolicyPage;
