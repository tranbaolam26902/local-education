export default function Container({ children, className }) {
    return <section className={`mx-auto px-6 max-w-screen-2xl${className ? ' ' + className : ''}`}>{children}</section>;
}
