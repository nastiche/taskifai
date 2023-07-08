import useSWR from "swr";
import styled from "styled-components";
import TaskCard from "../components/TaskCard";
import { useEffect, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import Layout from "../components/Layout";
import { StyledLink } from "../components/NavigationLink/NavigationLink";
import { IconContainer } from "../components/IconContainer";
import { Icon } from "../components/Icon";
import { Button } from "../components/Button/Button";
import { StyledContainer } from "../components/StyledContainer";

const headerText = "taskifAI";
const homeButtonShow = false;

export default function TasksListPage() {
  // Fetch task data using useSWR hook
  const { data, isLoading } = useSWR("/api/tasks", { fallbackData: [] });

  // State variables
  const [sortedTasks, setSortedTasks] = useState([]); // Array to store sorted tasks
  const [sortType, setSortType] = useLocalStorageState(
    "sortType",
    "creation_date"
  ); // Sort type state with local storage persistence
  const [sortDirection, setSortDirection] = useLocalStorageState(
    "sort direction",
    "asc"
  ); // Sort direction state

  // Function to convert priority string to a corresponding number
  const priorityToNumber = (priority) => {
    switch (priority) {
      case "low":
        return 1;
      case "medium":
        return 2;
      case "high":
        return 3;
      default:
        return 0;
    }
  };

  // Function to toggle the sort direction between ascending and descending
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  useEffect(() => {
    // Sorting logic based on the selected sort type
    const sortArray = (type) => {
      const types = {
        deadline: "deadline",
        creation_date: "creation_date",
        edit_date: "edit_date",
        priority: "priority",
      };
      const sortProperty = types[type];
      if (data.length > 0) {
        const sorted = [...data].sort((a, b) => {
          // Sort based on the sort property
          if (sortProperty === "deadline") {
            return new Date(a[sortProperty]) - new Date(b[sortProperty]);
          } else if (sortProperty === "creation_date") {
            return new Date(b[sortProperty]) - new Date(a[sortProperty]);
          } else if (sortProperty === "edit_date") {
            return new Date(b[sortProperty]) - new Date(a[sortProperty]);
          } else if (sortProperty === "priority") {
            return (
              priorityToNumber(a[sortProperty]) -
              priorityToNumber(b[sortProperty])
            );
          }
          return 0;
        });

        const sortedWithDirection =
          sortDirection === "asc" ? sorted : sorted.reverse();

        setSortedTasks(sortedWithDirection);
      }
    };

    sortArray(sortType);
  }, [sortType, sortDirection, data]);

  if (isLoading) {
    return (
      <>
        <EmptyDiv></EmptyDiv>
        <StyledLoadingDiv>...loading...</StyledLoadingDiv>
      </>
    );
  } else {
    return (
      <>
        <Layout headerText={headerText} homeButtonShow={homeButtonShow}>
          <StyledContainer>
            <StyledWrapper>
              <SortContainer>
                <StyledSelect
                  onChange={(event) => setSortType(event.target.value)}
                  value={sortType}
                >
                  <option value="deadline">sort by deadline</option>
                  <option value="priority">sort by priority</option>
                  <option value="creation_date">sort by creation date</option>
                  <option value="edit_date_date">sort by edit date</option>
                </StyledSelect>
                <StyledIcon>
                  <Icon labelText={`sort tasks list`} />
                </StyledIcon>
              </SortContainer>
              {/* Button to toggle the sort direction */}
              <Button
                onClick={toggleSortDirection}
                value={sortDirection}
                variant="small"
              >
                {sortDirection === "asc" ? (
                  <Icon labelText={`sort tasks list in ascending order`} />
                ) : (
                  <Icon labelText={`sort tasks list in descending order`} />
                )}
              </Button>
            </StyledWrapper>
            <TasksList role="list">
              {/* Render task preview cards for each sorted task */}
              {sortedTasks.map((task) => {
                return (
                  <ListItem key={task._id}>
                    <TaskCard
                      title={task.title}
                      tags={task.tags}
                      deadline={task.deadline}
                      priority={task.priority}
                      id={task._id}
                      subtasks={task.subtasks}
                      original_task_description={task.original_task_description}
                      image_url={task.image_url}
                    />
                  </ListItem>
                );
              })}
            </TasksList>
            <IconContainer variant="fixed">
              <StyledLink href={`/create`} aria-hidden="true" variant="big">
                <Icon labelText={"go to the task creation page"} />
              </StyledLink>
            </IconContainer>
          </StyledContainer>
        </Layout>
      </>
    );
  }
}

// Styled components for styling
const TasksList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.3rem;
  padding-left: 0;
  margin-bottom: 110px;
  margin-top: 70px;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
`;

const ListItem = styled.li`
  position: relative;
  width: 100%;
`;

const EmptyDiv = styled.div`
  height: 28px;
`;

const StyledLoadingDiv = styled.div`
  display: flex;
  justify-content: center;
  background-color: #a3ffb7;
`;

const StyledWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  padding-left: 1.1rem;
  padding-right: 1.1rem;
  position: fixed;
  top: 3;
  z-index: 1;
  height: 60px;
  width: 100%;
  padding-top: 25px;
  padding-bottom: 3px;
  justify-content: flex-end;
`;

const SortContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 40px;
  width: 40px;
`;

const StyledSelect = styled.select`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  height: 50px;
  width: 50px;
  background-color: var(--black-color);
  border: none;
  height: var(--button-small);
  width: var(--button-small);
  position: absolute;
  z-index: 2;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const StyledIcon = styled.span`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1.5rem;
  width: 1.5rem;
  z-index: 3;
  pointer-events: none; /* Add pointer-events: none */
`;
