export const Checkbox = ({ checked }:{ checked: boolean }) => {
    if (checked) {
        return (
            <svg width="28" height="32" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 0L27.8564 8V24L14 32L0.143594 24V8L14 0Z" fill="#56F020"/>
            </svg>
        );
    } else {
        return (
            <svg width="28" height="32" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.643594 8.28868L14 0.57735L27.3564 8.28868V23.7113L14 31.4227L0.643594 23.7113V8.28868Z" fill="#090B09" stroke="#6AF953"/>
            </svg>
        );
    }
}