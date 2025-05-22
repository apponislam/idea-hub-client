import ContactForm from "@/components/forms/contact-us-form";
import { Card } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us - Sustainability Idea Hub",
    description: "Get in touch with our team for questions, support, or partnership opportunities.",
};

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Information */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Our Information</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium">Email</h3>
                                <p className="text-muted-foreground">support@sustainabilityhub.com</p>
                            </div>
                            <div>
                                <h3 className="font-medium">Phone</h3>
                                <p className="text-muted-foreground">+1 (555) 123-4567</p>
                            </div>
                            <div>
                                <h3 className="font-medium">Address</h3>
                                <p className="text-muted-foreground">
                                    123 Green Way
                                    <br />
                                    Eco City, EC 12345
                                    <br />
                                    United States
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium">Office Hours</h3>
                                <p className="text-muted-foreground">
                                    Monday - Friday: 9:00 AM - 5:00 PM
                                    <br />
                                    Saturday: 10:00 AM - 2:00 PM
                                    <br />
                                    Sunday: Closed
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Contact Form */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Send Us a Message</h2>
                        <ContactForm />
                    </Card>
                </div>
            </div>
        </div>
    );
}
