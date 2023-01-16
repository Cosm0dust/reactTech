import './App.css';
import Counter from "./components/Counter/Counter";
import ClassCounter from "./components/Counter/ClassCounter";

import {useEffect, useMemo, useState} from "react";
import Postlist from "./components/PostList/Postlist";
import PostForm from "./components/PostForm/PostForm";
import MySelect from "./components/UI/Select/MySelect";
import MyInput from "./components/UI/input/MyInput";
import PostFilter from "./components/PostFilter/PostFilter";
import MyModal from "./components/MyModal/MyModal";
import MyButton from "./components/UI/button/MyButton";
import {usePosts} from "./hooks/usePosts";
import axios from "axios";
import PostService from "./API/PostService";
import Loader from "./components/UI/Loader/Loader";
import {useFetching} from "./hooks/useFetching";
import {getPageCount, getPagesArray} from "./utils/pages";
import Pagination from "./components/UI/pagination/Pagination";

function App() {
    const [posts, setPosts] = useState([])
    /*const bodyInputRef = useRef()*/
    const [filter,setFilter] = useState({sort: '', query: ''})
    const [modal, setModal] = useState(false)
    const [totalPages, setTotalPages]= useState(0)
    const [limit, setLimit]= useState(10)
    const [page, setPage]= useState(10)
    const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query)

    const [fetchPosts, isPostsLoading, postError] = useFetching( async(limit, page) => {
        const response = await PostService.getAll(limit, page)
        setPosts(response.data)
        const totalCount = response.headers['x-total-count']
        setTotalPages(getPageCount(totalCount, limit))
    })

    console.log(totalPages)

    useEffect(()=>{
        fetchPosts(limit,page)
    },[])

    const removePost = (post) => {
        setPosts(posts.filter(p => p.id !== post.id))
    }

    const changePage = (page) => {
        setPage(page)
        fetchPosts(limit, page)
    }

    const createPost = (newPost) => {
        setPosts([...posts, newPost])
        setModal(false)
    }

    return (
        <div className="App">
            <button onClick={fetchPosts}>Get Posts</button>
            <MyButton style={{marginTop : 30}} onClick ={()=> setModal(true)}>Create User</MyButton>
            <MyModal visible={modal} setVisible={setModal}>
                <PostForm create={createPost}/>
            </MyModal>
            <hr style={{margin:'15px 0'}}/>
            <PostFilter filter={filter} setFilter={setFilter}/>
            {postError &&
                <h1>Error: {postError}</h1>}
            {isPostsLoading
                ? <div style={{display: 'flex', justifyContent: 'center', marginTop: '50'}}><Loader /></div>
                : <Postlist remove={removePost} posts={sortedAndSearchedPosts} title='Postlist'/>}
            <Pagination page={page}
                        changePage={changePage}
                        totalPages={totalPages}/>
        </div>
    );
}

export default App;