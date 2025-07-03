import React from 'react';

export function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages === 1) return null; // Если всего 1 страница — не показываем пагинацию

    const pages = [...Array(totalPages).keys()].map(n => n + 1);

    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    return (
        <nav>
            <ul className="pagination justify-content-center modern-pagination mt-3">
                <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={handlePrev}
                        aria-label="Previous"
                        tabIndex={currentPage === 1 ? -1 : 0}
                    >
                        &laquo;
                    </button>
                </li>

                {pages.map((pageNum) => (
                    <li
                        key={pageNum}
                        className={`page-item${currentPage === pageNum ? ' active' : ''}`}
                    >
                        <button className="page-link" onClick={() => onPageChange(pageNum)}>
                            {pageNum}
                        </button>
                    </li>
                ))}

                <li className={`page-item${currentPage === totalPages ? ' disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={handleNext}
                        aria-label="Next"
                        tabIndex={currentPage === totalPages ? -1 : 0}
                    >
                        &raquo;
                    </button>
                </li>
            </ul>
        </nav>

    );
}
