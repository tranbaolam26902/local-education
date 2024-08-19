export default function InfoHotspotPreview(lesson) {
    const container = document.createElement('div');
    container.classList.add('flex', 'flex-col', 'gap-y-4', 'p-1', 'w-80', 'bg-white', 'dark:bg-dark', 'dark:text-white', 'rounded-lg');

    const img = document.createElement('img');
    img.classList.add('w-full', 'aspect-video', 'object-center', 'object-cover', 'rounded');
    img.src = `${import.meta.env.VITE_API_ENDPOINT}/${lesson.thumbnailPath}`;
    img.alt = lesson.title;

    const title = document.createElement('p');
    title.classList.add('px-4', 'py-1', 'font-semibold', 'text-center', 'line-clamp-2');
    title.textContent = lesson.title;

    container.appendChild(img);
    container.appendChild(title);

    return container;
}
