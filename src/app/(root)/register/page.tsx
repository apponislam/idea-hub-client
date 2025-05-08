import { RegisterForm } from "@/components/forms/register-form";

const page = () => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 from-background to-muted">
            <div className="w-full max-w-md space-y-6 bg-card p-8 rounded-lg shadow-md border">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Register Page</h1>
                    {/* <p className="text-muted-foreground mt-2">Enter your credentials to login</p> */}
                </div>
                <RegisterForm />
            </div>
        </main>
    );
};

export default page;
