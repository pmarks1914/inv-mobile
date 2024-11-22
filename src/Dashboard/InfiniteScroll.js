import React, { useState, useEffect, useRef, useCallback } from 'react';

function InfiniteScroll() {

  // get old invoice list
  let invoiceGetData = JSON.parse(localStorage.getItem("invoice"));

  const [data, setData] = useState([]); // Holds the data
  const [page, setPage] = useState(1); // Track the page number
  const [loading, setLoading] = useState(false); // Loading state
  const [hasMore, setHasMore] = useState(true); // To check if there's more data

  const observerRef = useRef(null);

  // Function to fetch data
  const fetchData = async () => {
    if (loading) return;
    setLoading(true);

    // Example API URL - replace with your data source
    // const response = await fetch(`https://api.example.com/data?page=${page}`);
    // const newData = await response.json();

    // setData((prevData) => [...prevData, ...newData.items]);
    // setHasMore(newData.items.length > 0); // Check if there's more data
    setData(invoiceGetData)
    setHasMore(invoiceGetData?.length > 0)
    setLoading(false);
    console.log("invoiceGetData ", invoiceGetData)
  };

  // IntersectionObserver callback
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore]
  );

  // Fetch data when the page changes
  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <div>
      {data.map((item, index) => (
        <div key={index} style={{ padding: '20px', borderBottom: '1px solid #ddd' }}>
          {item?.date} {/* Render your item */}
        </div>
      ))}

      {/* Loading indicator */}
      {loading && <p>Loading more items...</p>}

      {/* The last div acts as a target for the observer */}
      <div ref={lastElementRef} style={{ height: '1px' }} />
    </div>
  );
}

export default InfiniteScroll;
