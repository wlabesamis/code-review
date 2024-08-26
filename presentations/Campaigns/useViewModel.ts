import { useState, useEffect, SetStateAction } from 'react';
import { useRouter } from 'next/router';

import _ from 'lodash';
import moment from 'moment';

import {
  useGetCampaignsQuery,
  useDeleteCampaign,
  useDeactivateCampaign,
  useActivateCampaign,
  useGetCampaignById,
  useDetachSegment,
} from 'common/api/campaigns';

import { CAMPAIGNS_ACTIONS, CAMPAIGNS_FILTERS } from 'common/helpers/constants';

import type { TSort } from 'common/types/table';
import { capitalizeString } from 'common/helpers';
import { TCampaignSegment } from 'common/types/campaigns';

const useViewModel = () => {
  const router = useRouter();

  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [campaignsList, setCampaignsList] = useState<{ [key: string]: any }[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);

  const [sortByProps, setSortByProps] = useState<TSort>({ key: 'id', type: 'desc' });

  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [collapsedItems, setCollapsedItems] = useState<string[]>([]);

  const [showBulkActions, setShowBulkActions] = useState<boolean>(false);

  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: any }[]>([]);

  // Tab state
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const tabs = ['All', 'Ongoing', 'Upcoming', 'Completed', 'Draft'];
  const currentTab = tabs[selectedTab] === 'All' ? '' : tabs[selectedTab];

  // Search state
  const [search, setSearch] = useState<string>('');

  // Toggle Delete Modal
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  // Toggle Success Delete Modal
  const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState<boolean>(false);

  // Current Campaign selected from ellipsis action
  const [currentCampaignId, setCurrentCampaignId] = useState<string>('');

  // Campaign Status Dialog
  const [showUpdateStatusDialog, setShowUpdateStatusDialog] = useState<boolean>(false);

  // Campaign Status Success Dialog
  const [showUpdateStatusSuccessDialog, setShowUpdateStatusSuccessDialog] =
    useState<boolean>(false);

  // Status Update mode (activate/deactivate)
  const [updateStatusMode, setUpdateStatusMode] = useState<'' | 'activate' | 'deactivate'>('');

  // Selected campaign item in table
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');

  // Selected Segment for detachment
  const [selectedSegment, setSelectedSegment] = useState<TCampaignSegment>({
    campaignId: '',
    segmentId: '',
    contacts: '',
    name: '',
    campaignName: '',
  });

  const [showDetachDialog, setShowDetachDialog] = useState<boolean>(false);

  const getFilterValue = (filter: string) => {
    const filterValue = _.find(selectedFilters, (filterItem) => filterItem.label === filter);

    return filterValue?.value && filterValue?.value !== 'all' ? filterValue.value : undefined;
  };

  const {
    data,
    isFetching: isQueryLoading,
    isError,
    refetch,
  } = useGetCampaignsQuery({
    page: currentPage,
    perPage,
    sort: sortByProps.key === 'campaignId' ? 'id' : sortByProps.key,
    order: sortByProps.type || 'desc',
    status: currentTab ? currentTab : search ? undefined : getFilterValue('Status')?.join(','),
    type: search ? undefined : getFilterValue('Schedule')?.join(','),
    category: search ? undefined : getFilterValue('Category')?.join(','),
    search,
  });

  const campaignData = useGetCampaignById(selectedCampaignId);
  const deleteCampaign = useDeleteCampaign();
  const activateCampaign = useActivateCampaign();
  const deactivateCampaign = useDeactivateCampaign();
  const detachSegment = useDetachSegment();

  useEffect(() => {
    if (!isQueryLoading) {
      if (!isError) {
        const actionsMenu = [
          {
            name: 'ongoing',
            actions: ['View Campaign', 'Cancel'],
            inactiveActions: ['Update Campaign', 'Cancel', 'Delete'],
          },
          { name: 'upcoming', actions: ['View Campaign', 'Cancel', 'Delete'] },
          { name: 'completed', actions: ['View Campaign'] },
          { name: 'draft', actions: ['Update Campaign', 'Delete'] },
        ];

        const mappedData = _.map(data?.data?.rows, (campaign) => {
          const activeStatus = campaign?.activeStatus?.toLowerCase();
          return {
            id: campaign?.uuid,
            campaignId: campaign?.id,
            name: campaign?.name,
            segments: campaign?.segments,
            category: capitalizeString(campaign?.category?.toLowerCase()),
            channel: transformCampaignChannels(JSON.parse(campaign?.channel)),
            type: capitalizeString(campaign?.type?.toLowerCase()),
            activeStatus: activeStatus,
            collapsibleData: [],
            actions:
              _.find(actionsMenu, (item) => item.name === campaign?.status?.toLowerCase())?.[
                campaign?.status?.toLowerCase() === 'ongoing' && activeStatus === 'inactive'
                  ? 'inactiveActions'
                  : 'actions'
              ] || [],
          };
        });

        setCollapsedItems([]);
        setCampaignsList([...mappedData]);
        setIsEmpty(_.size(mappedData) < 1);
      } else {
        setIsEmpty(true);
      }
    }
  }, [data, isQueryLoading]);

  useEffect(() => {
    if (_.size(checkedItems) > 0) {
      setShowBulkActions(true);
    } else {
      setShowBulkActions(false);
    }
  }, [checkedItems]);

  /** Update Campaign list after create */
  const handleRefetch = async () => {
    refetch();
  };

  useEffect(() => {
    if (router?.query && router?.query?.refresh) {
      handleRefetch();
    }
  }, [router.query]);

  const transformCampaignChannels = (channels: string[]) => {
    const transformChannel = _.map(channels, (channel: string) => {
      if (channel === 'sms') {
        return 'SMS';
      } else {
        return channel.charAt(0).toUpperCase() + channel.slice(1);
      }
    });

    return _.join(transformChannel, ', ');
  };

  const handleCreate = () => {
    router.push('/campaigns/new');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (perPage: string | number) => {
    setCurrentPage(1);
    setPerPage(Number(perPage));
  };

  const handleSortList = (key: string) => {
    // Disabled nosort
    // const noSort = ['segments', 'category', 'schedule'];

    // if (!noSort.includes(key)) {

    const sortKey = key;
    // if (sortKey === 'status') {
    //   sortKey = 'activeStatus';
    // }

    // if (sortKey === 'schedule') {
    //   sortKey = 'status';
    // }

    const isSortedByKey = sortByProps.key === sortKey;

    if (isSortedByKey) {
      setSortByProps({ key: sortKey, type: sortByProps.type === 'asc' ? 'desc' : 'asc' });
    } else {
      setSortByProps({ key: sortKey, type: 'asc' });
    }
    // }
  };

  const handleCollapseItem = async (item: { id: string }) => {
    await setSelectedCampaignId(item.id);

    const isCollapsed = collapsedItems.includes(item.id);

    if (isCollapsed) {
      const removeItem = _.remove(collapsedItems, item.id);
      setCollapsedItems(removeItem);
    } else {
      setCollapsedItems([...collapsedItems, item.id]);

      const campaignDataRes = await campaignData?.refetch();

      const segmentData = campaignDataRes?.data?.data?.segment?.map(
        (x: { name: string; count: number; segmentId: string }) => {
          return {
            campaignId: item?.id,
            segmentId: x?.segmentId,
            name: x?.name,
            contacts: x?.count,
            campaignName: campaignDataRes?.data?.data?.name,
          };
        }
      );

      const updatedCampaignList = _.map(campaignsList, (cmp) => {
        if (cmp?.id === item.id) {
          return {
            ...cmp,
            collapsibleData: segmentData || [],
          };
        }
        return cmp;
      });

      setCampaignsList(updatedCampaignList);
    }
  };

  const handleCheckItem = (item: { [key: string]: any } | 'all') => {
    if (item !== 'all') {
      const { id } = item;
      const isChecked = checkedItems.includes(id);

      if (isChecked) {
        const removeItem = _.remove(checkedItems, (item) => item !== id);
        setCheckedItems(removeItem);
      } else {
        setCheckedItems([...checkedItems, id]);
      }
    } else {
      const isSelectedAll =
        _.size(
          _.difference(
            _.map(campaignsList, (item) => item.id),
            checkedItems
          )
        ) == 0;

      if (isSelectedAll) {
        const rowsToRemove = _.map(
          _.filter(campaignsList, (item) => checkedItems.includes(item.id)),
          (item) => item.id
        );
        const removeRows = _.filter(checkedItems, (item) => !rowsToRemove.includes(item));
        setCheckedItems([...removeRows]);
      } else {
        const getAllIds = _.map(campaignsList, (item) => item.id);
        setCheckedItems(_.uniq([...checkedItems, ...getAllIds]));
      }
    }
  };

  const handleCloseBulkActions = () => {
    setShowBulkActions(false);
    setCheckedItems([]);
  };


  /**
   *
   * Note:
   *  
   * if the handleBulkActionsPress has only console.log at it will be use for debugging
   * ensure to remove it or use other library that can be toggle of in production environments
   * execessive logging can impact performance 
   * 
   */
  const handleBulkActionsPress = (action: string) => {
    console.log(action);
    // if (action === 'delete') {
    //   setShowBulkDeleteDialog(true);
    // } else if (action === 'deactivate') {
    //   setShowBulkDeactivateDialog(true);
    // }
  };

  /**
   * 
   * Note:
   * 
   * Each block of code in handleFilterSelectChange for different filter types (campaign-status, schedule, category) is quite similar. 
   * To make the code more maintainable and reduce repetition, consider refactoring it.
   * 
   * - Added `_.uniq` to the `value` array to prevent duplicate "all" values.
   * 
   */
  const handleFilterSelectChange = (id: number) => {
    const isFilterSelected = _.find(selectedFilters, (filter) => filter.id === id);

    if (isFilterSelected) {
      const removeItem = _.remove(selectedFilters, (filter) => filter.id !== id);
      setSelectedFilters(removeItem);
    } else {
      const filterLabel = _.find(CAMPAIGNS_FILTERS, (filter) => filter.id === id);
  
      if (filterLabel) {
        const filterOptions = {
          'campaign-status': {
            options: [
              { id: 1, label: 'Show All', value: 'all' },
              { id: 2, label: 'Ongoing', value: 'ongoing' },
              { id: 3, label: 'Upcoming', value: 'upcoming' },
              { id: 4, label: 'Completed', value: 'completed' },
              { id: 5, label: 'Draft', value: 'draft' },
            ],
            label: 'Status'
          },
          'schedule': {
            options: [
              { id: 1, label: 'Show All', value: 'all' },
              { id: 2, label: 'Now', value: 'now' },
              { id: 3, label: 'Later', value: 'later' },
              { id: 4, label: 'Recurring', value: 'recurring' },
            ],
            label: 'Schedule'
          },
          'category': {
            options: [
              { id: 1, label: 'Show All', value: 'all' },
              { id: 2, label: 'Transaction', value: 'transaction' },
              { id: 3, label: 'Advisories', value: 'advisories' },
              { id: 4, label: 'Promos', value: 'promos' },
            ],
            label: 'Category'
          }
        };
  
        const optionsConfig = filterOptions[filterLabel.value];
  
        if (optionsConfig) {
          const { options, label } = optionsConfig;
          const selected = {
            id: filterLabel.id,
            label,
            type: 'multi-select',
            options,
            value: _.uniq(['all', ..._.map(options, (option) => option.value)]),
          };
  
          setSelectedFilters([...selectedFilters, selected]);
        }
      }
    }
  };

  /**
   * 
   * The refactored code introduces the updateFilterValue function, 
   * which significantly reduces redundancy by abstracting the repeated logic of updating the selectedFilters array. 
   * This enhances maintainability and readability. The updateFilterValue function is reusable for future extensions, 
   * should more filter types be added.
   * 
   * 
   */

  const updateFilterValue = (id, updateFn) => {
    const updatedFilters = _.map(selectedFilters, (filter) => {
      if (filter.id === id) {
        return { ...filter, ...updateFn(filter) };
      } else {
        return filter;
      }
    });
    
    setSelectedFilters(updatedFilters);
  };

  const handleFilterValueChange = (filter: {
    id: string | number;
    type: 'dropdown' | 'date-range' | 'multi-select';
    value: any;
  }) => {
    setCurrentPage(1);
    setCheckedItems([]);
    const { id, type, value } = filter;

    if (type === 'dropdown') {
      updateFilterValue(id, () => ({ value }));
    } else if (type === 'date-range') {
      const newValue = {
        start: moment(value[0].startDate).format('YYYY-MM-DD'),
        end: moment(value[0].endDate).format('YYYY-MM-DD'),
      };

      updateFilterValue(id, () => ({ value: newValue }));
    } else if (type === 'multi-select') {
      const filter = _.find(selectedFilters, (filter) => filter.id === id);

      if (!filter?.value.includes('all') && value.includes('all')) {
        updateFilterValue(id, () => ({ value: _.map(filter?.options, (option) => option.value) }));
      } else if (_.size(value) === _.size(filter?.options) - 1) {
        if (!value.includes('all') && !filter?.value.includes('all')) {
          updateFilterValue(id, () => ({ value: ['all', ...value] }));
        } else if (!value.includes('all') && filter?.value.includes('all')) {
          updateFilterValue(id, () => ({ value: [] }));
        } else {
          updateFilterValue(id, () => ({ value: _.remove(value, (option) => option !== 'all') }));
        }
      } else {
        updateFilterValue(id, () => ({ value: _.remove(value, (option) => option !== 'all') }));
      }
    }
  };

  // Close Delete Modal, reset current campaign ID
  const handleCloseDeleteModal = () => {
    setCurrentCampaignId('');
    setShowDeleteDialog(false);
  };

  // Close Deactivate Modal, reset current campaign ID
  const handleCloseUpdateStatusModal = () => {
    setCurrentCampaignId('');
    setShowUpdateStatusDialog(false);
  };

  // Handle Delete Campaign
  const handleConfirmDelete = async () => {
    try {
      const deleteCampaignRes = await deleteCampaign.mutateAsync(currentCampaignId);
      if (deleteCampaignRes?.data?.status === 200) {
        setShowDeleteSuccessDialog(true);
        refetch();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setShowDeleteDialog(false);
    }
  };

  /**
   * 
   * statusActions object maps updateStatusMode values to the corresponding functions (deactivateCampaign and activateCampaign). 
   * This allows you to select the appropriate function dynamically, reducing code repetition.
   * 
   */
  // Handle Activate/Deactivate Campaign
  const handleUpdateStatus = async () => {
    const statusActions = {
      deactivate: deactivateCampaign,
      activate: activateCampaign,
    };
  
    const selectedAction = statusActions[updateStatusMode];
  
    if (selectedAction) {
      try {
        const response = await selectedAction.mutateAsync(currentCampaignId);
        if (response?.data?.status === 200) {
          setShowUpdateStatusSuccessDialog(true);
          refetch();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setShowUpdateStatusDialog(false);
      }
    }
  };

  const handleActionPress = async (data: any) => {
    const campaignId = data?.item?.id;

    if (campaignId) {
      switch (data?.action) {
        // View Campaign
        case 'View Campaign':
          router.push(`/campaigns/view/${campaignId}`);
          break;

        // View Campaign
        case 'Update Campaign':
          router.push(`/campaigns/update/${campaignId}`);
          break;
        // Delete Campaign
        case 'Delete':
          setCurrentCampaignId(campaignId);
          setShowDeleteDialog(true);
          break;
        // Deactivate Campaign
        case 'Pause':
          setCurrentCampaignId(campaignId);
          setUpdateStatusMode('deactivate');
          setShowUpdateStatusDialog(true);
          break;
        // Activate Campaign
        case 'Send':
          setCurrentCampaignId(campaignId);
          setUpdateStatusMode('activate');
          setShowUpdateStatusDialog(true);
          break;

        default:
          break;
      }
    }
  };

  const handleTabChange = (value: SetStateAction<number>) => setSelectedTab(value);

  const handleSearchChange = (value: string) => setSearch(value);

  const confirmDetachSegment = async (segment: TCampaignSegment) => {
    setSelectedSegment(segment);
    setShowDetachDialog(true);
  };

  const handleDetachSegment = async (segment: TCampaignSegment) => {
    try {
      await detachSegment.mutateAsync({
        campaignId: segment.campaignId,
        segmentId: segment.segmentId,
      });

      await refetch();
    } catch (error) {
      console.error(error);
    } finally {
      handleCloseDetachDialog();
    }
  };

  const handleCloseDetachDialog = () => {
    setSelectedSegment({
      campaignId: '',
      segmentId: '',
      contacts: '',
      name: '',
      campaignName: '',
    });
    setShowDetachDialog(false);
  };

  return {
    handleCreate,
    campaignsList,
    isQueryLoading,
    isEmpty,
    pagination: { lastPage: data?.data?.totalPages, total: data?.data?.count },

    currentPage,
    perPage,
    handlePageChange,
    handlePerPageChange,

    sortByProps,
    handleSortList,

    collapsedItems,
    handleCollapseItem,

    handleCheckItem,
    checkedItems,

    actions: CAMPAIGNS_ACTIONS,
    showBulkActions,
    handleCloseBulkActions,
    handleBulkActionsPress,

    filters: CAMPAIGNS_FILTERS,
    selectedFilters,
    handleFilterSelectChange,
    handleFilterValueChange,
    handleActionPress,

    handleTabChange,
    selectedTab,
    tabs,

    handleSearchChange,
    search,
    showDeleteDialog,
    handleCloseDeleteModal,
    handleConfirmDelete,
    showDeleteSuccessDialog,
    setShowDeleteSuccessDialog,
    showUpdateStatusDialog,
    setShowUpdateStatusDialog,
    handleCloseUpdateStatusModal,
    showUpdateStatusSuccessDialog,
    setShowUpdateStatusSuccessDialog,
    handleUpdateStatus,
    updateStatusMode,
    confirmDetachSegment,
    showDetachDialog,
    selectedSegment,
    handleDetachSegment,
    handleCloseDetachDialog,
  };
};

export default useViewModel;
