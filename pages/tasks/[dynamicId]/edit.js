import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";
import styled from "styled-components";
import RegularTaskInputForm from "../../../components/RegularTaskInputForm";
import { toast } from "react-toastify";
import Layout from "../../../components/Layout";

const headerText = "edit task";
const homeButtonShow = true;

// Mesagge for info banner
const BannerMessageSaved = () => <div>Task saved!</div>;

export default function TaskEditPage() {
  const router = useRouter();
  const { isReady } = router;
  const { dynamicId } = router.query;
  const {
    data: existingTaskData,
    isLoading,
    error,
    mutate,
  } = useSWR(`/api/tasks/${dynamicId}`);

  async function editTask(existingTaskData) {
    const response = await fetch(`/api/tasks/${dynamicId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(existingTaskData),
    });
    if (response.ok) {
      mutate();
    }
    router.push(`/tasks/${dynamicId}`);

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

  if (!isReady || isLoading || error) return <h2>Loading...</h2>;

  return (
    <Layout headerText={headerText} homeButtonShow={homeButtonShow}>
      <RegularTaskInputForm
        onSubmit={editTask}
        formName={"edit-task"}
        existingTaskData={existingTaskData}
        backLink={dynamicId}
      />
    </Layout>
  );
}

const LinkWrapper = styled.div`
  font-size: 3rem;
  a {
    text-decoration: none;
  }
`;
