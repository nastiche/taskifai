import { useRouter } from "next/router";
import useSWR from "swr";
import styled from "styled-components";
import RegularTaskInputForm from "../components/RegularTaskInputForm";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import { StyledContainer } from "../components/StyledContainer";

const headerText = "edit task";
const homeButtonShow = true;

// Mesagge for info banner
const BannerMessageSaved = () => <div>Task saved!</div>;

export default function TaskEditPage() {
  const router = useRouter();
  const { isReady } = router;
  const { id } = router.query;
  const {
    data: existingTaskData,
    isLoading,
    error,
    mutate,
  } = useSWR(`/api/tasks/edit?id=${id}`);

  async function editTask(existingTaskData) {
    const response = await fetch(`/api/tasks/edit?id=${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(existingTaskData),
    });
    if (response.ok) {
      mutate();
    }
    router.push(`/`);

    // Info banner
    toast.success(<BannerMessageSaved />, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }

  if (!isReady || isLoading || error)
    return (
      <>
        <EmptyDivLoading></EmptyDivLoading>
        <StyledLoadingDiv>...loading...</StyledLoadingDiv>
      </>
    );

  return (
    <Layout headerText={headerText} homeButtonShow={homeButtonShow}>
      <StyledContainer>
        <EmptyDiv></EmptyDiv>
        <RegularTaskInputForm
          onSubmit={editTask}
          formName={"edit-task"}
          existingTaskData={existingTaskData}
          backLink={`/`}
        />
      </StyledContainer>
    </Layout>
  );
}


const EmptyDiv = styled.div`
  height: 60px;
`;
const LinkWrapper = styled.div`
  font-size: 3rem;
  a {
    text-decoration: none;
  }
`;

const EmptyDivLoading = styled.div`
  height: 28px;
`;

const StyledLoadingDiv = styled.div`
  display: flex;
  justify-content: center;
  background-color: #a3ffb7;
`;
