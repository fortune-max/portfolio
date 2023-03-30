export const Projects = () => {
    return (
        <div className="flex flex-col p-4 bg-black gap-4 m-12 rounded-xl text-primary">
            <p>&gt; Projects 🔧</p>
            <div>
                <ul className="list-disc px-8 flex flex-col gap-4">
                    <li><a href="https://github.com/fortune-max/class-projects" className="hover:underline">Front-End Projects</a>: A directory of my front-end projects from my classes so far.</li>
                    <li>Skylight: Student management system for handling student records including class report generation, GPA calculation, result generation, class summaries, course registrations, result entry, progression of students to higher levels when applicable. Allows for multiple simultaneous users, fine-grained access permissions. Running on a locally-hosted Pi server. Client app built with Kivy. Technologies - REST, Python, Kivy, Swagger, SQLalchemy, Flask, Bcrypt, wkhtmltopdf, pipenv, Git, Linux, PDFkit, SQL.</li><li>Giveaway: Class giveaway site for distributing airtime to classmates on a first-come, first-serve basis. Usually done as a fun activity by people celebrating and this serves to do it more fairly than previously used methods. Technologies - PythonAnywhere (cloud), Python, flask, uWSGI, Flutterwave (payments), JavaScript, HTML & CSS, Requests.</li>
                    <li>CCTP: Android security modification that logs device screen and location backing up on a server and locally, also allows remote admin access to aid in finding a stolen or missing Android device or remotely extracting then deleting sensitive files. Persists after factory reset and is more resilient/feature-packed than Google’s in-built Find my Device. Technologies - Shell, Python, C, Linux, GCP, cURL, SSH, Android.</li>
                    <li>MTK ADB: Android app for obtaining root access on MediaTek devices without voiding warranty (removed by a restart) by exploiting a self-discovered vulnerability on pre-Lollipop devices. Technologies - Android, Linux, Java, ADB, Shell, Security.</li>
                    <li>UnVault: Proof of concept work done to analyze NetQin’s Vault app (100 million-plus downloads), for securely encrypting user files. Project done in Python and successfully decrypted all tested file types showing an attacker could breach this security. Technologies - Python, Security.</li>
                    <li>PTP: Utility built during lockdown period to allow sharing large files amongst people with the same cell carrier without data costs to either user. Useful when physically meeting is infeasible. Takes advantage of a vulnerability with how ISPs handle denied TCP packets to infer data being sent. Technologies - Python, Shell, Math, Networking, Security.</li>
                    <li>Status Manager: Utility for temporarily caching Status videos from WhatsApp messaging client to view later (outside of the default 24hr window). Useful if you want to keep up with close friends uploads but are overly occupied on most days and would rather dedicate a single time window each week rather than each day for it. Technologies - Python, SQL, Linux, regex.</li>
                    <li>Student Pay: Instant messaging payment bot targeted towards students and merchants in universities. Allows for making quick free payments to other students/sellers. Maintaining a wallet that can be funded and paid out to conventional bank accounts and linked to a card for easy funding. Allows for generating account summaries of inflows and outflows for easy bookkeeping. Technologies - OOP, Python, GCP, REST, SQL, Flutterwave (payments), Requests.</li>
                </ul>
            </div>
        </div>
    );
};
