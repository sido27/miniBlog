import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import ReactHtmlParser from "react-html-parser";
import "../App.css";
import { formatDate } from "../utils/DateFormat";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import { toast } from "react-toastify";
import { AuthContext } from "../App";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const authContext = useContext(AuthContext);

  //const [isCollapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const fetchedPosts = async () => {
      setIsLoading(true);
      const getDatas = await Axios.get("/api/posts", {
        signal: signal,
      });
      setData(getDatas.data.allPosts);
      setIsLoading(false);
    };
    fetchedPosts();
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const handDeleteAll = () => {
    try {
      const res = Axios.delete(`/api/posts/post-details/`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log("res" + res);
      toast.success(res.data.message, {
        autoClose: 3000,
        position: toast.POSITION.BOTTOM_RIGHT,
      });

      setData([]);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, {
        autoClose: 3000,
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  const handleDeleteButton = async (postid) => {
    try {
      const res = await Axios.delete(`/api/posts/post-details/${postid}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log("res" + res);
      toast.success(res.data.message, {
        autoClose: 3000,
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      const newData = data.filter((item) => item._id !== postid);
      setData(newData);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, {
        autoClose: 3000,
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <div>Cargando....</div>
      ) : (
        <div className="container mt-3">
          <h1 className="text-justify mb-4">The Blogstar Blog</h1>
          {data && data.length > 0 ? (
            data.map((item, index) => {
              return (
                <div className="row mb-3" key={index}>
                  <div className="col-12">
                    <div className="card">
                      <div className="card-body text-justify">
                        <h1 className="card-title text-left">{item.title}</h1>
                        <div className="d-flex">
                          <p className="card-text text-justify mr-3">
                            <i
                              className="fa fa-user mr-1"
                              aria-hidden="true"
                            ></i>
                            {item.author.name}
                          </p>
                          <p className="card-text text-justify">
                            <i
                              className="fa fa-calendar mr-1"
                              aria-hidden="true"
                            ></i>
                            {formatDate(item.createdAt)}
                          </p>
                          <p>
                            <i className="fa fa-comments ml-2 mr-1"></i>
                            <span className="badge badge-info mr-2 text-white">
                              {item.comments.length}
                            </span>
                            comments
                          </p>
                        </div>
                        {ReactHtmlParser(item.content.substring(0, 150))}
                        <div>
                          {/* <Link 
                                                    style={{ textDecoration: 'none' }} 
                                                    to={`/posts/post-details/${item._id}`}>
                                                    <Button className="btn btn-white">
                                                        Read More 
                                                    </Button>
                                                </Link> */}
                          <Link
                            style={{ textDecoration: "none" }}
                            to={{
                              pathname: `/posts/post-details/${item._id}`,
                              author: item.author.name,
                            }}
                          >
                            <Button className="btn btn-white">
                              <i
                                className="fa fa-arrow-right"
                                aria-hidden="true"
                                title="Read More"
                              ></i>
                            </Button>
                          </Link>
                          {authContext.userState.user &&
                            authContext.userState.user._id ===
                              item.author._id && (
                              <>
                                <Button
                                  className="btn btn-danger ml-3"
                                  onClick={() => handleDeleteButton(item._id)}
                                >
                                  <i
                                    className="fa fa-trash"
                                    aria-hidden="true"
                                    title="Delete"
                                  ></i>
                                </Button>
                              </>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div>Nothing in database!</div>
          )}

          {/*     <button className="btn btn-danger">DELETE ALL</button> */}
        </div>
      )}
    </>
  );
};

export default Dashboard;
