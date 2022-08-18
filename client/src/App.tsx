import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { trpc } from "./trpc";
import { useState } from "react";
import Wrapper from "./Wrapper";

function App() {
  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: "http://localhost:8002/trpc",
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function AppContent() {
  const [id, setId] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(2000);
  

  const helloMessage = trpc.useQuery(["hello"]);

  const cars = trpc.useQuery(["getCars"]);
  const addCar = trpc.useMutation(["createCar"]);
  const client = trpc.useContext()

  if (!cars.data) return <div>Loading...</div>;

  console.log(helloMessage);

  const submit = async (e) => {
    e.preventDefault();

    const data = {
        id,
        brand,
        model,
        year,
    }
    addCar.mutate(data, {
      onSuccess(v) {
        client.invalidateQueries(["getCars"])
      }
    });


    e.target.reset();
    


  };

  return (
    <Wrapper>
      <form className="mt-3" onSubmit={submit}>
        <div className="form-floating pb-3">
          <input
            className="form-control"
            placeholder="Id Car"
            onChange={(e) => setId(e.target.value)}
          />
          <label>Id</label>
        </div>

        <div className="form-floating pb-3">
          <input
            className="form-control"
            placeholder="Car Brand"
            onChange={(e) => setBrand(e.target.value)}
          />
          <label>Brand</label>
        </div>

        <div className="form-floating pb-3">
          <input
            className="form-control"
            placeholder="Car Model"
            onChange={(e) => setModel(e.target.value)}
          />
          <label>Model</label>
        </div>

        <div className="form-floating pb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Car Year"
            onChange={(e) => setYear(Number(e.target.value))}
          />
          <label>Year</label>
        </div>

        <button className="w-100 btn btn-lg btn-primary" type="submit">
          Submit
        </button>

        <br />

        <table className="table caption-top">
          <caption>List of cars</caption>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Brand</th>
              <th scope="col">Model</th>
              <th scope="col">Year</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.data?.map((c) => {
              return (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.brand}</td>
                  <td>{c.model}</td>
                  <td>{c.year}</td>
                  <td>
                    <a href="#" className="btn btn-sm btn-outline-danger">
                      Delete
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </form>
    </Wrapper>
  );
}

export default App;
