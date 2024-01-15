import { Card, Grid, Group, Text, rem } from "@mantine/core";
import React from "react";
import DisplayInformation from "./parts/display-information/DisplayInformation";
import ProfileSettings from "./parts/profile-settings/ProfileSettings";
import { IconUserCircle } from "@tabler/icons-react";

type Props = {};

const ProfileSection = (props: Props) => {
  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder>
      <Group justify="flex-start">
        <IconUserCircle
          style={{ width: rem(30), height: rem(30) }}
          stroke={1.5}
          color="gray"
        />
        <Text size="md">Profile</Text>
      </Group>
      <Grid>
        <Grid.Col span={{ base: 12, sm: 4, md: 3 }}>
          <DisplayInformation />
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 8, md: 9 }}>
          <ProfileSettings />
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default ProfileSection;
