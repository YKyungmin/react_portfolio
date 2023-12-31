//해당 페이지에서 설명해보라, 혹시 이슈사항은 없었는지?

import Layout from '../../common/layout/Layout';
import './Community.scss';
import { useRef, useState, useEffect } from 'react';

export default function Community() {
	const dummyData = [
		{
			title: 'title4',
			content: 'Here comes content description in detail4.',
			data: new Date(),
		},
		{
			title: 'title3',
			content: 'Here comes content description in detail3.',
			data: new Date(),
		},
		{
			title: 'title2',
			content: 'Here comes content description in detail2.',
			data: new Date(),
		},
		{
			title: 'title1',
			content: 'Here comes content description in detail1.',
			data: new Date(),
		},
	];

	const getLocalData = () => {
		const data = localStorage.getItem('post');
		if (data) return JSON.parse(data);
		else return dummyData;
	};
	const refInput = useRef(null);
	const refTextarea = useRef(null);
	const refEditInput = useRef(null);
	const refEditTextarea = useRef(null);

	const [Posts, setPosts] = useState(getLocalData());
	const [Allowed, setAllowed] = useState(true);
	console.log(Posts);

	const resetForm = () => {
		refInput.current.value = '';
		refTextarea.current.value = '';
	};
	const createPost = () => {
		if (!refInput.current.value.trim() || !refTextarea.current.value.trim()) {
			resetForm();
			return alert('제목과 본문을 모두 입력하세요.');
		}
		setPosts([
			{
				title: refInput.current.value,
				content: refTextarea.current.value,
				data: new Date(),
			},
			...Posts,
		]);
		resetForm();
	};

	const deletePost = (delIndex) => {
		if (window.confirm('정말 해당 게시글을 삭제하겠습니까?')) {
			setPosts(Posts.filter((_, idx) => delIndex !== idx));
		}
	};

	const enableUpdate = (editIndex) => {
		if (!Allowed) return;
		setAllowed(false);
		setPosts(
			Posts.map((post, idx) => {
				if (editIndex === idx) post.enableUpdate = true;
				return post;
			})
		);
	};

	//해당 글을 출력모드로 변경시키는 함수
	const disableUpdate = (editIndex) => {
		setAllowed(true);
		setPosts(
			Posts.map((post, idx) => {
				if (editIndex === idx) post.enableUpdate = false;
				return post;
			})
		);
	};

	const updatePost = (updateIndex) => {
		setPosts(
			Posts.map((post, idx) => {
				if (updateIndex === idx) {
					post.title = refEditInput.current.value;
					post.content = refEditTextarea.current.value;
				}
				return post;
			})
		);
	};

	useEffect(() => {
		localStorage.setItem('post', JSON.stringify(Posts));
	}, [Posts]);

	return (
		<Layout title={'Community'}>
			<div className='inputBox'>
				<h2>Comment</h2>
				<input ref={refInput} type='text' placeholder='제목을 입력하세요.' />
				<br />
				<textarea
					ref={refTextarea}
					cols='30'
					rows='3'
					placeholder='본문을 입력하세요.'
				></textarea>

				<nav className='btnSet'>
					<button onClick={resetForm}>cancel</button>
					<button onClick={createPost}>write</button>
				</nav>
			</div>

			<div className='showBox'>
				{Posts.map((post, idx) => {
					const string = JSON.stringify(post.data);
					const [year, month, date] = string
						.split('T')[0]
						.split('"')[1]
						.split('-');
					let [hour, min, sec] = string.split('T')[1].split('.')[0].split(':');
					hour = parseInt(hour) + 9;
					hour >= 24 && (hour = hour - 24);

					if (post.enableUpdate) {
						// 수정 모드 렌더링
						return (
							<article key={idx}>
								<div className='txt'>
									<input
										type='text'
										defaultValue={post.title}
										ref={refEditInput}
									/>
									<br />
									<textarea defaultValue={post.content} ref={refEditTextarea} />
								</div>
								<nav className='btnSet'>
									<button onClick={() => disableUpdate(idx)}>Cancel</button>
									<button
										onClick={() => {
											updatePost(idx);
											disableUpdate(idx);
										}}
									>
										Update
									</button>
								</nav>
							</article>
						);
					} else {
						return (
							<article key={idx}>
								<div className='txt'>
									<h2>{post.title}</h2>
									<p className='txt_content'>{post.content}</p>
									<p className='txt_date '>{`Date : ${year} / ${month} / ${date}`}</p>
									<p className='txt_time '>{`Time : ${hour}:${min}:${sec}`}</p>
								</div>
								<nav className='btnSet'>
									<button onClick={() => enableUpdate(idx)}>Edit</button>
									<button onClick={() => deletePost(idx)}>Delete</button>
								</nav>
							</article>
						);
					}
				})}

				{/* dummyData 출력 */}
				{dummyData.map((post, idx) => (
					<article key={idx}>
						<div className='txt'>
							<h2>{post.title}</h2>
							<p className='txt_content'>{post.content}</p>
							<p className='txt_date'>{`Date: ${post.data.toLocaleDateString()}`}</p>
							<p className='txt_time'>{`Time: ${post.data.toLocaleTimeString()}`}</p>
						</div>
					</article>
				))}
			</div>
		</Layout>
	);
}

/*
아직 데이터베이스를 배우진 않았지만 CRUD기능 구현하고 싶어서 로컬저장소를 활용해서 만들어 봤다.
이슈사항으로는 시간값을 가져왔는데 로컬저장소에 글이 저장되는 시점의 시간을 표준시로 저장을 해서 현재시간보다 9시간이 늦은 시간으로 출력되는 문제가 있었다.
시간값을 변경하려고 보니 JSON.parse로 객체형태로 시간을 불러와져서 split 메서드를 쓸수가 없는데 이유를 몰라서 삽질했습니다.


객체형태로 변환된 값을 다시 stringify로 문자화시킨다음에 split으로 문자값 가공하고 다시 화면에 출력
두번째 이슈사항으로 친구컴퓨터로 내 작업물을 확인해보니 해당 브라우저에는 저장된 데이터가 없어서 커뮤니티 페이지가 빈화면으로 출력되는 이슈 --> 로컬저장소에 값이 없을때 더미 데이터가 출력되도록 했다.

*/
