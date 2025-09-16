import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ShoppingList = ({ plannedMeals, onGenerateList, onExportList }) => {
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [groupBy, setGroupBy] = useState('category');
  const [showChecked, setShowChecked] = useState(true);

  // MOCK DATA COMMENTED OUT. Now fetched from Supabase below.
  /*
  const shoppingItems = [ ... ];
  */

  // Supabase Table: shopping_items
  // Columns: id, user_id, name, quantity, category, store, price, recipes (text[]), priority, checked (boolean), created_at

  const [shoppingItems, setShoppingItems] = useState([]);

  useEffect(() => {
    const fetchShoppingItems = async () => {
      // You may want to filter by user_id or plannedMeals
      const { data, error } = await supabase
        .from('shopping_items')
        .select('*');
      if (!error && data) {
        setShoppingItems(data);
      }
    };
    fetchShoppingItems();
  }, []);

  const toggleItem = (itemId) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems?.has(itemId)) {
      newCheckedItems?.delete(itemId);
    } else {
      newCheckedItems?.add(itemId);
    }
    setCheckedItems(newCheckedItems);
  };

  const groupItems = (items) => {
    if (groupBy === 'category') {
      return items?.reduce((groups, item) => {
        const category = item?.category;
        if (!groups?.[category]) groups[category] = [];
        groups?.[category]?.push(item);
        return groups;
      }, {});
    } else if (groupBy === 'store') {
      return items?.reduce((groups, item) => {
        const store = item?.store;
        if (!groups?.[store]) groups[store] = [];
        groups?.[store]?.push(item);
        return groups;
      }, {});
    }
    return { 'All Items': items };
  };

  const filteredItems = showChecked 
    ? shoppingItems 
    : shoppingItems?.filter(item => !checkedItems?.has(item?.id));

  const groupedItems = groupItems(filteredItems);
  const totalPrice = shoppingItems?.reduce((sum, item) => sum + item?.price, 0);
  const checkedPrice = shoppingItems?.filter(item => checkedItems?.has(item?.id))?.reduce((sum, item) => sum + item?.price, 0);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertCircle';
      case 'medium': return 'Clock';
      case 'low': return 'CheckCircle';
      default: return 'Circle';
    }
  };

  const ShoppingItem = ({ item }) => {
    const isChecked = checkedItems?.has(item?.id);
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
          isChecked 
            ? 'bg-muted/50 border-success/30 opacity-60' :'bg-card border-border hover:border-primary/30'
        }`}
      >
        <Checkbox
          checked={isChecked}
          onChange={() => toggleItem(item?.id)}
          size="default"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={`font-body font-medium ${
              isChecked ? 'line-through text-muted-foreground' : 'text-foreground'
            }`}>
              {item?.name}
            </h4>
            <div className="flex items-center space-x-2">
              <Icon 
                name={getPriorityIcon(item?.priority)} 
                size={12} 
                color={`var(--color-${item?.priority === 'high' ? 'error' : item?.priority === 'medium' ? 'warning' : 'success'})`}
              />
              <span className="font-mono text-sm font-semibold text-foreground">
                ${item?.price?.toFixed(2)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm text-muted-foreground">
              {item?.quantity}
            </span>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>{item?.store}</span>
              {item?.recipes?.length > 1 && (
                <>
                  <span>•</span>
                  <span>{item?.recipes?.length} recipes</span>
                </>
              )}
            </div>
          </div>
          
          {item?.recipes?.length > 0 && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-1">
                {item?.recipes?.slice(0, 2)?.map((recipe, index) => (
                  <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {recipe}
                  </span>
                ))}
                {item?.recipes?.length > 2 && (
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                    +{item?.recipes?.length - 2} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="ShoppingCart" size={20} color="var(--color-primary)" />
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground">
              Shopping List
            </h2>
            <p className="text-sm text-muted-foreground">
              Generated from {plannedMeals?.length} planned meals
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            onClick={onGenerateList}
          >
            Regenerate
          </Button>
          <Button
            variant="default"
            size="sm"
            iconName="Download"
            onClick={onExportList}
          >
            Export
          </Button>
        </div>
      </div>
      {/* Controls */}
      <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-body text-foreground">Group by:</span>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e?.target?.value)}
              className="text-sm border border-border rounded-md px-2 py-1 bg-background text-foreground"
            >
              <option value="category">Category</option>
              <option value="store">Store Section</option>
              <option value="none">No Grouping</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={showChecked}
              onChange={(e) => setShowChecked(e?.target?.checked)}
              label="Show completed items"
              size="sm"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <div className="text-muted-foreground">
            {checkedItems?.size} of {shoppingItems?.length} items completed
          </div>
          <div className="font-mono font-semibold text-foreground">
            Total: ${totalPrice?.toFixed(2)}
          </div>
        </div>
      </div>
      {/* Shopping List */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {Object.entries(groupedItems)?.map(([groupName, items]) => (
            <motion.div
              key={groupName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 last:mb-0"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-foreground flex items-center space-x-2">
                  <Icon name="Package" size={16} />
                  <span>{groupName}</span>
                  <span className="text-sm text-muted-foreground font-normal">
                    ({items?.length} items)
                  </span>
                </h3>
                <div className="text-sm font-mono text-muted-foreground">
                  ${items?.reduce((sum, item) => sum + item?.price, 0)?.toFixed(2)}
                </div>
              </div>
              
              <div className="space-y-2">
                <AnimatePresence>
                  {items?.map((item) => (
                    <ShoppingItem key={item?.id} item={item} />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Summary */}
        <div className="mt-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 border border-primary/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-heading font-bold text-foreground">
                {shoppingItems?.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-heading font-bold text-success">
                {checkedItems?.size}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-heading font-bold text-primary">
                ${(totalPrice - checkedPrice)?.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Remaining Cost</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;