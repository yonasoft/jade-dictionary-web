import { HoverCard, List, Text } from "@mantine/core";

export const SearchHoverCard = ({
  searchBar,
}: {
  searchBar: React.ReactNode;
}): React.ReactNode => {
  return (
    <HoverCard width={280} shadow="md">
      <HoverCard.Target >{searchBar}</HoverCard.Target>
      <HoverCard.Dropdown>
        <Text size="md" fw={700}>
          Search Dictionary
        </Text>
        <List type="unordered" listStyleType="disc" size="sm">
          <List.Item>
            <Text size="sm">
              Press&nbsp;
              <strong>Ctrl+K</strong>&nbsp; for quick access
            </Text>
          </List.Item>
          <List.Item>
            <Text size="sm">Example Inputs:</Text>
            <Text size="xs">
              <strong>比如</strong> | <strong>Example</strong> |{" "}
              <strong>bǐ rú</strong> | <strong>bi3 ru2</strong> |{" "}
            </Text>
          </List.Item>
        </List>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};
