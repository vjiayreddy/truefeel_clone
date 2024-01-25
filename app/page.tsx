"use client";
import React, { useEffect, useState } from "react";
import DefaultLayoutComponent from "@/components/Layout/Default/Default";
import AllAssessmentsComponent from "@/components/Home/Assessments/Assessments";
import ProgramsListComponent from "@/components/Home/ProgramsList/ProgramsList";
import { withAuthHoc } from "@/components/Common/AuthHoc/AuthHoc";
import { useLazyFetchDashboardDataQuery } from "@/redux/api/patientsApi";
import { useSession } from "next-auth/react";
import AssessmentsList from "@/components/views/home/patient/AssessmentsList";
import UserHomeLayout from "@/components/layouts/patient/homeLayout";

const HomePage = () => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const { data: session } = useSession();
  const [fetchDashboardData, { data: assessmentsData, isLoading, isError }] =
    useLazyFetchDashboardDataQuery();

  const fetchPatientsSurveisList = async () => {
    await fetchDashboardData({
      userId: session?.user?.id as string,
    });
  };

  useEffect(() => {
    if (session?.user) {
      fetchPatientsSurveisList();
    }
  }, [session]);

  return (
    <UserHomeLayout
      loading={isLoading}
      bottomNavigationProps={{
        value: tabIndex,
        onChange(_, value) {
          setTabIndex(value);
        },
      }}
    >
      {tabIndex == 0 && (
        <AssessmentsList
          isLoadingAssessments={isLoading}
          data={assessmentsData}
        />
      )}
      {tabIndex == 1 && <ProgramsListComponent />}
    </UserHomeLayout>
  );
};

export default withAuthHoc(HomePage);
