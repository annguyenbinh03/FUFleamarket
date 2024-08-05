
const Pagination = ({ maxPage, changePage, pageNumber }) => {
  const pageNumbers = Array.from({ length: maxPage }, (_, index) => index + 1);
  return (
    <div className="product__pagination d-flex justify-content-center">
      {pageNumbers.map((number) =>
        parseInt(pageNumber) === number ? (
          <button
            className="bg-info text-white"
            key={number}
            onClick={() => changePage(number)}
          >
            {number}
          </button>
        ) : (
          <button key={number} onClick={() => changePage(number)}>
            {number}
          </button>
        )
      )}
    </div>
  );
};

export default Pagination;
